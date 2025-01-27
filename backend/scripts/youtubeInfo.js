const { google } = require('googleapis');
const { MongoClient } = require('mongodb');

const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyC_1EUvTLZOzDOOapahSzW6xpbGkM_SYvs' // Nouvelle clé API YouTube
});

async function getVideoInfo(videoId) {
  try {
    const response = await youtube.videos.list({
      part: 'snippet,statistics',
      id: videoId
    });

    if (response.data.items.length === 0) {
      throw new Error(`Vidéo non trouvée: ${videoId}`);
    }

    const video = response.data.items[0];
    return {
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.high.url,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      publishedAt: video.snippet.publishedAt
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des infos pour ${videoId}:`, error);
    return null;
  }
}

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function updatePostsWithYouTubeInfo() {
  const uri = "mongodb+srv://DevCursor:HPObjvsaUqoFCodG@flegm.c9ohz.mongodb.net/flegm?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connecté à MongoDB');
    
    const db = client.db('flegm');
    const posts = await db.collection('posts').find().toArray();
    
    for (const post of posts) {
      const videoId = extractVideoId(post.videoUrl);
      if (!videoId) {
        console.log(`ID de vidéo non trouvé pour: ${post.videoUrl}`);
        continue;
      }

      console.log(`Récupération des infos pour la vidéo: ${videoId}`);
      const videoInfo = await getVideoInfo(videoId);
      
      if (videoInfo) {
        await db.collection('posts').updateOne(
          { _id: post._id },
          { 
            $set: {
              youtubeId: videoId,
              title: videoInfo.title,
              description: videoInfo.description,
              thumbnailUrl: videoInfo.thumbnailUrl,
              youtubeStats: {
                viewCount: videoInfo.viewCount,
                likeCount: videoInfo.likeCount,
                publishedAt: videoInfo.publishedAt
              }
            }
          }
        );
        console.log(`Post mis à jour: ${post._id}`);
      }
    }
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await client.close();
    console.log('Déconnecté de MongoDB');
  }
}

updatePostsWithYouTubeInfo(); 