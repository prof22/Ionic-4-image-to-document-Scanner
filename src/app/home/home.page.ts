import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, PictureSourceType } from '@ionic-native/camera/ngx';
import { NgProgress } from '@ngx-progressbar/core';
import * as Tesseract from 'tesseract.js';
import { reject } from 'q';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  selectedImage: string
  imageText: string
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public progress: NgProgress
    ) {}

    selectSource()
    {
     
      let actionsheet =  this.actionSheetCtrl.create({
        buttons:[
          {
            text:'Use Library',
            handler:() =>{
              this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
              
            }
          },{
            text:'Use Camere',
            handler:() =>{
              this.getPicture(this.camera.PictureSourceType.CAMERA);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      }).then(actionsheet=> actionsheet.present());
    }
  
    getPicture(sourceType: PictureSourceType)
    {
      this.camera.getPicture({
        quality:100,
        destinationType:this.camera.DestinationType.DATA_URL,
        sourceType:sourceType,
        allowEdit: true,
        saveToPhotoAlbum: false,
        correctOrientation:true
      }).then(imageData => {
        this.selectedImage = `data:image/jpeg;base64,${imageData}`;
      });
    }

    recognizeImage()
    {
    //  return new Promise<string>
    //  ((resolve, reject) => {
    //   Tesseract.recognize(this.selectedImage)
    //   .progress((message) =>
    //   console.log(message.status))
    //   .catch((err)=>
    //   reject(err))
    //   .then((result) =>
    //   resolve(result.text))
    //  });
      


       Tesseract.recognize(this.selectedImage)
      .progress(message => {
        if(message.status === 'recognizing text'){
          this.progress.ref(message.status)
        }
      })
      .catch(err=>console.error(err))
      .then(result =>{
        this.imageText = result.text;
      })
      .finally(resultOrError =>{
        this.progress.destroyAll();
      })
    }
}
