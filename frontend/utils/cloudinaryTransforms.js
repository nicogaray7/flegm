import { Transformation } from "@cloudinary/url-gen";

export const videoTransforms = {
  thumbnail: new Transformation()
    .width(300)
    .height(300)
    .gravity("auto")
    .crop("fill")
    .format("jpg"),
    
  preview: new Transformation()
    .width(640)
    .height(360)
    .gravity("auto")
    .crop("fill")
    .quality("auto")
    .format("auto")
}; 