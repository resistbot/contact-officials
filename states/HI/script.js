
const zipList = [96719, 96755, 96743, 96738, 96740, 96725, 96750, 96704, 96722, 96726, 96763];

const countyHash = {
  "Hawaii" : "East Hawai'i Island",
  "Honululu" : "O'ahu",
  "Kalawao" : "Molaka'i",
  "Kauai" : "Kaua'i",
  "Maui" : "Maui" // except for 96763 which is Lana'i
}

function findRegion(county,zip){
  console.log(`Running... for ${ county }, ${ zip }`);
  // Check the zip zipList
  //  if the zip is in the zip list and is 96763, then the region is "Lana'i"
  if (zip == 96763) {
    console.log("lanai");
    return "Lana'i";
  }
  //  if the zip is in the zip list and not 96763, the region is "West Hawai'i Island"
  else if (zipList.includes(zip)) {
    console.log("west HI");
    return "West Hawai'i Island";
  }
  //  if the zip is not in the zip list, retrieve the value from the countyHash,
  else {
    console.log(`${ countyHash[county] }`);
    return countyHash[county];
  }
}

// s/b lanai
findRegion("some county", 96763);

// s/b west Hawaii
findRegion("some county", 96755);

// s/b east Hawaii
findRegion("Hawaii", 12345);




// County : Dropdown
// Hawaii : East Hawai'i Island except for zip codes below*
// Honululu : O'ahu
// Kalawao : Molaka'i
// Kauai : Kaua'i
// Maui : Maui except for 96763 which is Lana'i
//
// West Hawai'i Island:
// 96719, 96755, 96743, 96738, 96740, 96725, 96750, 96704, 96722, 96726


// Minimized:

const zipList=[96719,96755,96743,96738,96740,96725,96750,96704,96722,96726,96763];const countyHash={"Hawaii":"East Hawai'i Island","Honululu":"O'ahu","Kalawao":"Molaka'i","Kauai":"Kaua'i","Maui":"Maui"}
function findRegion(county,zip){if(zip==96763){return"Lana'i"}
else if(zipList.includes(zip)){return"West Hawai'i Island"}
else{return countyHash[county]}}

// s/b lanai
findRegion("some county", 96763);

// s/b west Hawaii
findRegion("some county", 96755);

// s/b east Hawaii
findRegion("Hawaii", 12345);
