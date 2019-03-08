//
// ** Special handling for Hawaii governor. **
// Hawaii has a 'region' dropdown that doesn't correlate directly to any address component we currently collect.  So we have connected the region to a county where we can, and a zip code where we cannot.  See comments in this file for more details.

// This JS is included in a separate file for readability and ease of editing.  All comments have been removed, and copied into the yaml.  The same steps should take place should this JS need to be edited.
//

// The form config has an address line 2 field.  A step in the form_config will put the $ADDRESS_COUNTY value in it so we can use it in this script, then later clear it so it is not actually submitted with the form.
var county = document.getElementById('input_1_9_2').value;
var zip = document.getElementById('input_1_9_5').value;

// These are the zips where we determine the region by the zip code rather than county.
const zipList = ['96719', '96755', '96743', '96738', '96740', '96725', '96750', '96704', '96722', '96726', '96763']

// These are the regions we can determine by county.  NOTE: The apostrophes in the values of this hash (the region names) are right apostrophes (Unicode U+2019).  The regular straight apostrophe (Unicode U+0027) will not match on the form.
const countyHash = {
  'Hawaii' : 'East Hawaiʻi Island',
  'Honolulu' : 'Oʻahu',
  'Kalawao' : 'Molokaʻi',
  'Kauai' : 'Kauaʻi',
  'Maui' : 'Maui' // except for 96763 which is Lanaʻi
}

var region = function findRegion(county,zip) {
  // if the zip is in the zip list and is 96763, then the region is 'Lanaʻi
  if (zip == '96763') {
    var r = 'Lanaʻi';
  }
  // if the zip is in the zip list and not 96763, the region is 'West Hawaiʻi Island'
  else if (zipList.includes(zip)) {
    var r = 'West Hawaiʻi Island';
  }
  // if the zip is not in the zip list, retrieve the value from the countyHash
  else {
    var r = countyHash[county];
  }
  return r;
}

document.getElementById('input_1_18').value = region(county,zip);
// Clear out the address 2 field:
document.getElementById('input_1_9_2').value ='';

// Some tests
// s/b lanai
// findRegion('some county', 96763);

// s/b west Hawaii
// findRegion('some county', 96755);

// s/b east Hawaii
// findRegion('Hawaii', 12345);
