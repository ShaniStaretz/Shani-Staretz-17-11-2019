import { Injectable } from '@angular/core';
import { topCitiesesUrl, apiKey, currentCityConditions, autocompleteUrl, cityForecasts } from 'src/app/modules/endpoint';
import { City } from 'src/app/modules/city';

import { Day } from 'src/app/modules/day';

import { ICONS } from 'src/assets/weatherIcons';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  citiesUrl: string;
  autocompleteUrl: string;
  cities: City[];

  constructor() {
    this.cities = new Array();
    this.citiesUrl = `${topCitiesesUrl}apikey=${apiKey}`;
    this.autocompleteUrl = `${autocompleteUrl}apikey=${apiKey}&q=`
  }

  async getTopCities() {

    try {
      const response = await fetch(this.citiesUrl);
      const data = await response.json();
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          this.cities[k] = {
            cityId: data[k].Key,
            cityName: data[k].LocalizedName,
            //     // today: await this.getCity(myData[i].Key),
            today: null,
            weekDays: null
          }
        }
      }
      return this.cities;

    } catch (err) {
      alert(err);
      return null
    }

  }

  async getforecasts(cityID: string) {

    let url = `${cityForecasts}${cityID}?apikey=${apiKey}&metric=true`;

    var weekDays: Day[] = [];
    try {
      const response = await fetch(url);
      const data = await response.json();

      const dForecasts = data.DailyForecasts;


      for (let i = 0; i < dForecasts.length; i++) {
        let temp: Day = { date: dForecasts[i].Date, degree: { celsius: dForecasts[i].Temperature.Minimum.Value + '\xB0C', fahrenheit: this.cToF(dForecasts[i].Temperature.Minimum.Value) }, logoUrl: this.getLogoURL(dForecasts[i].Day.Icon) }
        weekDays.push(temp);

      }

      return weekDays;

    } catch (err) {
      alert(err);
      return null
    }

  }

  async getAutocompleteCity(cityName: string) {
    var foundCities: City[] = [];
    let url = `${this.autocompleteUrl}${cityName}`;
    try {
      const response = await fetch(url);

      const data = await response.json();
      for (const k in data) {
        if (data.hasOwnProperty(k)) {

          foundCities[k] = {
            cityId: data[k].Key,
            cityName: data[k].LocalizedName,
            //     // today: await this.getCity(myData[i].Key),
            today: null,
            weekDays: null
          }

        }

      }

      return foundCities;

    } catch (err) {
      alert(err);
      // console.error(err);
      return null
    }

  }

  async getCurrentCityWeather(id: string): Promise<Day> {

    var url = `${currentCityConditions}${id}?apikey=${apiKey}`;
    try {

      const response = await fetch(url)

      const data = await response.json();

      if (data[0] !== null) {
        return {
          date: data[0].LocalObservationDateTime,
          degree: {
            celsius: data[0].Temperature.Metric.Value,
            fahrenheit: data[0].Temperature.Imperial.Value
          },
          logoUrl: this.getLogoURL(data[0].WeatherIcon),
        };
      }
      else {
        throw "no results";
      }
    }
    catch (error) {
      alert(error);
    }


  }
  // readCity(myData): Day {

  //   console.log("readCity");
  //   console.log("myData: ", myData);
  //   return {
  //     degree: {
  //       celsius: myData.Temperature.Metric.Value,
  //       fahrenheit: myData.Temperature.Imperial.Value
  //     },
  //     logoUrl: this.getLogoURL(myData.WeatherIcon),
  //     date: myData.LocalObservationDateTime
  //   }
  // }
  getLogoURL(weatherIcon): string {
    let res = ICONS.find(obj => obj.icon_id === weatherIcon);
    return res.imgSrc;
  }

  cToF(celsius): string {
    var cTemp = celsius;
    var cToFahr = cTemp * 9 / 5 + 32;
    // var message = cTemp+'\xB0C is ' + cToFahr + ' \xB0F.';
    // console.log(message);
    return cToFahr + ' \xB0F';
  }

  fToC(fahrenheit) {
    var fTemp = fahrenheit;
    var fToCel = (fTemp - 32) * 5 / 9;
    // var message = fTemp+'\xB0F is ' + fToCel + '\xB0C.';
    // console.log(message);
    return fToCel + '\xB0C';
  }

}
