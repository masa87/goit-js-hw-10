'use strict';
import './css/styles.css';
import { fetchCountries } from '../fetchCountries';
import Notiflix from 'notiflix';
import { debounce } from 'lodash';

const qs = selector => document.querySelector(selector);

const searchBox = qs('#search-box');
const countryList = qs('.country-list');
const countryInfo = qs('.country-info');

const DEBOUNCE_DELAY = 300;

const searchBoxValue = () => {
  fetchCountries(searchBox.value.trim())
    .then(countries => {
      console.log(countries);
      renderCountriesList(countries);
    })
    .catch(err => console.log(err));
};

Notiflix.Notify.info('Please type in correct country.');

const renderCountriesList = countries => {
  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches, please enter more characters.');
    listReset();
  } else if (countries.length <= 10 && countries.length >= 2) {
    listReset();

    countries.map(({ name, flags }) => {
      const liItem = document.createElement('li');
      liItem.classList.add('country-list_item');
      countryList.append(liItem);

      const miniFlags = document.createElement('img');
      miniFlags.src = flags.svg;
      miniFlags.classList.add('flags-mini_img');
      miniFlags.alt = 'country flag';
      liItem.append(miniFlags);

      const countryName = document.createElement('p');
      countryName.textContent = name;
      countryName.classList.add('country-list_name');
      liItem.append(countryName);
    });
  } else if (countries.length === 1) {
    listReset();

    const finalCountry = countries.map(({ name, flags, capital, population, languages }) => {
      return `<h1 class="country-info_name"><img src="${flags[0]}" class="flags-big_img"/>${name}</h1>
      <p class="country-info_item"><span>Capital: </span> ${capital} </p>
      <p class="country-info_item"><span>Population: </span> ${population} </p>
      <p class="country-info_item"><span>Languages: </span> ${languages[0].name}</p>
      `;
    });
    countryInfo.innerHTML = finalCountry;
  } else if (countries.length < 1) {
    Notiflix.Notify.info('Please type correct country.');
  }
};

const listReset = () => {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
};

searchBox.addEventListener('input', debounce(searchBoxValue, DEBOUNCE_DELAY));
