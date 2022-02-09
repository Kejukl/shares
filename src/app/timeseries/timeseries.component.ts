import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-timeseries',
  templateUrl: './timeseries.component.html',
  styleUrls: ['./timeseries.component.css']
})
export class TimeseriesComponent implements OnInit {
  title = 'Welcome to market news';
  marketSymbol = 'GSK';
  x = [];
  y = [];
  dataAvail = true;
  sharesArr = ['GSK', 'IBM', 'MSFT'];
/*   layout = {
    title: this.marketSymbol,
    xaxis: {
      linecolor: "navy",
      linewidth: 2,
      mirror: true,
      title: "Time",
      automargin: true
      },
      yaxis: {
        linecolor: "navy",
        linewidth: 2,
        mirror: true,
        title: "Price",
        automargin: true
        },
  }; */
  startDate: any;
  nextDate: any;
  constructor(private http: HttpClient) { }

  showGraph = false;

  ngOnInit(): void {
  }
  getAllData() {
    let myApi ='XXX' //enter your api key from alphavantage
    let urlMarket = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.marketSymbol}&interval=60min&apikey=${myApi}`;
    this.http.get(urlMarket).subscribe((data: any) => {
      this.deleteLoggedIn();
      this.setData(data);
    }, (err) => {
      console.error('Error in getItems: ', err);
    });
  }
  getData() {
    const store = localStorage.getItem('timeData') ? JSON.parse(localStorage.getItem('timeData')) : {};
    return store
  }
  timeSeriesPlot(){
    const store = this.getData();
    if (store['Meta Data'] && store['Meta Data']['2. Symbol'] === this.marketSymbol) {
      this.dataAvail = true;
      const MatchXAxisData  = Object.keys(store).find( x => x.match(/Time Series/g))
      if (MatchXAxisData){
        const timeSeries = store[MatchXAxisData];
        this.y = [];
        this.x = [...Object.keys(timeSeries)].sort(); // xdate
        this.x.forEach(timePoint =>{
          this.y.push(timeSeries[timePoint]['1. open']);
        })
        if ( this.x.length && this.x.length === this.y.length) {
          this.showGraph = true;
          this.plotGraph();
        }
      }
    } else {
      this.dataAvail = false;
      this.showGraph = false;
    }
  }
  setData(data: any) {
    localStorage.setItem('timeData', JSON.stringify(data));
  }
  deleteLoggedIn() {
    localStorage.removeItem('timeData');
  }
  data: any;
  layout: any;
  plotGraph(){

    console.log(this.x[0], '90')
    this.data = [
      {
        x: this.x,
        y: this.y,
        mode: 'lines+markers',
        type: 'scatter',
        line: {color: '#17BECF'}
      }
    ];
    this.layout = {
      title: this.marketSymbol,
      xaxis: {
        title: 'Date',
        showline: true,
        autotick: true, //  If "linear", the placement of the ticks is determined by a starting position `tick0` and a tick step `dtick`
        ticks: 'outside',
        ticklen: 8,
        tickwidth: 4,
        tickcolor: 'lightgrey',
        gridwidth: 2,
        gridcolor: 'lightgrey',
        titlefont: {
          color: '#17BECF'
        }
      },
      yaxis: {
        showline: true,
        ticklen: 8,
        tickwidth: 4,
        tickcolor: 'lightgrey',
        gridwidth: 2,
        gridcolor: 'lightgrey',
        title: 'Price $',
        titlefont: {
          family: 'Arial, sans-serif',
          size: 18,
          color: '#17BECF'
        },
        showticklabels: true,
        tickangle: 45,
      }
    }
  }

}
