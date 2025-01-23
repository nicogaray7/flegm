import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: 'dfupyozxe'
  },
  url: {
    secure: true
  }
});

export default cld; 