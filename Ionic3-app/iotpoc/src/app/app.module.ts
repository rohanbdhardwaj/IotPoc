import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';


import { MqttModule, MqttService, IMqttServiceOptions } from 'ngx-mqtt';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'broker.mqttdashboard.com',
  port: 8000,
  protocol: "ws",
  path: "/mqtt",
  clientId: "iotPoc_" + (Math.random() * 100000000000).toString()
};

// export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
//   hostname: '115.166.129.15',
//   port: 8000,
//   protocol: "ws",
//   path: "/"
// };

// username: "zpbhhyxf",
// password: "BkeQAcXlMrO8"

export function mqttServiceFactory() {
  return new MqttService(MQTT_SERVICE_OPTIONS);
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MqttModule.forRoot({
      provide: MqttService,
      useFactory: mqttServiceFactory
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
