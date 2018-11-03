import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import { StatsBarChart } from '../../shared/data';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  options: any = {};
  initOpts: any = {};
  width: number;
  height: number;
  margin = { top: 20, right: 20, bottom: 30, left: 40 };

  data = [];
  // data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 7, 4, 5, 6, 8, 7, 4, 5, 8, 4];

  x: any;
  y: any;
  svg: any;
  g: any;

  private subscription: Subscription;
  public message: string;

  constructor(
    public navCtrl: NavController,
    private mqttService: MqttService
  ) {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.subscribeTopic();


    // this.mqttService.disconnect();
    // this.connectService();
  }

  ionViewDidLoad() {
    this.setOptions();
  }

  connectService() {
    let options = {
      /** the hostname of the mqtt broker */
      hostname: '',
      /** the port to connect with websocket to the broker */
      port: 8000,
      /** the path parameters to connect to e.g. `/mqtt` */
      path: 'mqtt',
      protocol: 'ws'
    }
    this.mqttService.connect(options);
    this.subscribeTopic();
  }

  setOptions() {
    this.initSvg()
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }

  initSvg() {
    this.svg = d3.select("#barChart")
      .append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr('viewBox', '0 0 900 500');

    /*
    this.svg = d3.select("svg");
    this.width = +this.svg.attr("width") - this.margin.left - this.margin.right;
    this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;
    */
    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      .attr("fill", "steelblue");
  }

  initAxis() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(this.data.map((d) => d.pos));
    this.y.domain([0, d3Array.max(this.data, (d) => d.val)]);
  }

  drawAxis() {
    this.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x));
    this.g.append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y).ticks(10, "%"))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");
  }

  drawBars() {
    this.g.selectAll(".bar")
      .data(this.data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d) => this.x(d.pos))
      .attr("y", (d) => this.y(d.val))
      // .attr("width", (d) => {
      //   debugger;
      //   let v = this.x(d.pos);
      //   return v;
      // })
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => this.height - this.y(d.val));
  }

  subscribeTopic() {
    let that = this;
    this.subscription = this.mqttService.observe('my/topic').subscribe((message: IMqttMessage) => {
      let payload = message.payload.toString();
      let value = parseFloat(payload);
      if (!isNaN(value) && value > 0) {
        let bar = {
          pos: this.data.length + 1,
          val: value
        }
        this.data.push(bar);
        this.svg.remove();
        this.setOptions();
      }
    });
  }

  ionViewWillUnload() {
    this.subscription.unsubscribe();
  }

}
