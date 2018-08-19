# Contact Officials

Configuration files used by Resistbot to contact state and federal officials with their web forms.

The focus right now is on writing web form configs for those state legislative bodies which offer consistent contact forms for all members. These forms are as interoperable as possible with the [unitedstates/contact-congress](https://github.com/unitedstates/contact-congress) schema (i.e. Phantom of DC).

## Directory and file structure

```
- states
  - CA
    - rep_type
      * upper.yaml  # form config that applies for all members of California State Senate
      * lower.yaml  # for all members of California State Assembly
      * CAL000501.yaml  # if we want to use different form config for Sen. de León than other CA senators

  - TX
    - rep_type
      * upper.yaml  # for all members of Texas State Senate
      * lower.yaml  # for all members of Texas State House of Representatives

  ... directories for other states which have consistent web forms...

- congress
  * P000603.yaml  # for Rand Paul, resistbot uses this intead of contact-congress/P000603.yaml
  ... configs for other Members of Congress for whom resistbot has its own setup ...

- whitehouse
  * WH000045.yml  # for the 45th president (TODO)
  ... configs for other federal executives with web forms, as resistbot adds support ...
```

Notes:

- Bio IDs come from Biographical Directory of the United States Congress
  and from Open States. For other officials, we may invent a bio ID.

- `upper` and `lower` correspond to values that `chamber` takes in Open States.

- We will keep `congress` directory as sparse as possible, strongly
  preferring to defer to the config in `contact-congress`.

## Schema

Schema is same as [that of unitedstates/contact-congress](https://github.com/unitedstates/contact-congress/blob/master/documentation/schema.md) with these changes:

* New variables PHONE_AREA_CODE, PHONE3, PHONE4, PHONE7, NAME_FULL, NAME_PREFIX_NO_PERIOD.

* `bioguide`, `contact_form.method`, and `contact_form.action` are optional.

* In `fill_in` steps, `captcha_selector` can be an element enclosing text.
  The processor should strip non-word characters from beginning and end of this element's `textContent`,
  append `captcha_append_guidance` if present, and then submit this for textual
  captcha solving.

* Introduction of meta variables, described below.

## Meta variables

Collectively, state legislatures are huge. Let’s look at the three most populous states plus Ohio. These are the largest states that offer contact forms for their legislators.

* CA: 40 senators, 80 assemblymembers
* TX: 31 senators, 150 representatives
* FL: 40 senators, 120 representatives
* OH: 33 senators, 99 representatives

If we use one form config per bioguide, that’s 593 form config files. Moreover, if perhaps 20% of officials churn in an election cycle, that’s about 100 form config files we need to delete and 100 form config files we need to add. Worse, because the contact forms for these states’ representatives are maintained by the state, if a contact form changes, we need to update tens or hundreds of config files at once.

So it would be expedient if we can, in states with consistent forms per chamber, set up state form config files that can be used for every member of the chamber. We wouldn’t need to do anything to handle churn, since we are not hard-coding bioguides anywhere. If a contact form changes, we need to update only one config file.

Let's make it possible for form configs to reference dynamically an individual district or URL.

We introduce notion of “meta variable”, and make it possible to include `$META_VARIABLES` anywhere in the document. They will simply be replaced with the value of the variable, i.e. `config.replace('$META_OFFICIAL_DISTRICT', '07')`. The context must take care of quoting, if necessary.

For example, the CA senator config starts with:
```
- visit: "https://lcmspubcontact.lc.ca.gov/PublicLCMS/ContactPopup.php?district=SD$META_OFFICIAL_DISTRICT"
```
and the CA representative config with:
```
- visit: "https://lcmspubcontact.lc.ca.gov/PublicLCMS/ContactPopup.php?district=AD$META_OFFICIAL_DISTRICT"
```
The config for OH senate starts with:
```
- visit: "$META_OFFICIAL_URL"
```

The meta variables are:

- `$META_OFFICIAL_DISTRICT`: the district of the official, or empty string if official holds statewide office. This corresponds to `district` in Open States and theunitedstates.io Congress data, but normalized such that:
  a) single-digit district names get a leading zero, e.g. "07".
  b) at-large districts are "AL".

- `$META_OFFICIAL_URL`: the URL of the official homepage of the official. This corresponds to `url` in Open States and `url` in  theunitedstates.io Congress data.
