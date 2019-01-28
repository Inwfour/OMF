import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Camera, CameraOptions } from '@ionic-native/camera';
/*
  Generated class for the ImageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageProvider {
  public cameraImage : String
  constructor(public    http     : Http,
              private   _CAMERA   : Camera,
    ) {
    
  }

  camera() : Promise<any>
  {
    return new Promise(resolve =>
    {
      let cameraOptions: CameraOptions = {
        quality: 100,
        sourceType: this._CAMERA.PictureSourceType.CAMERA,
        destinationType: this._CAMERA.DestinationType.DATA_URL,
        encodingType: this._CAMERA.EncodingType.PNG,
        mediaType: this._CAMERA.MediaType.PICTURE,
        targetHeight: 300,
        targetWidth: 300,
      }

      this._CAMERA.getPicture(cameraOptions)
      .then((data) =>
      {
         this.cameraImage 	= "data:image/png;base64," + data;
         resolve(this.cameraImage);
      });

    }
  )};

  selectImage() : Promise<any>
  {
     return new Promise(resolve =>
     {
        let cameraOptions : CameraOptions = {
          quality             : 100,
          sourceType          : this._CAMERA.PictureSourceType.PHOTOLIBRARY,
          destinationType     : this._CAMERA.DestinationType.DATA_URL,
          saveToPhotoAlbum    : false,
          allowEdit           : true,
          targetHeight        : 300,
          targetWidth         : 300
        };

        this._CAMERA.getPicture(cameraOptions)
        .then((data) =>
        {
           this.cameraImage 	= "data:image/png;base64," + data;
           resolve(this.cameraImage);
        });
     });
  }


}
