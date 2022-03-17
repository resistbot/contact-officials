# Contact Officials

Configuration files used by Resistbot to contact state and federal officials with their web forms.

The focus right now is on writing web form configs for 1) governors and 2) state legislative bodies which offer consistent contact forms for all
members. These forms are as interoperable as possible with the
[unitedstates/contact-congress](https://github.com/unitedstates/contact-congress)
schema (i.e. Phantom of DC).

## Want to contribute? Help people write to their governors!

The document [_Teach Resistbot to send a message to a US Governor_](https://docs.google.com/document/d/1TAXWDPfISgRY_qESNGzfT4tFKFaDF3PPUPLK_vZI4Bs)
walks you through the steps to contribute a new `governor.yaml` to this repo.

Resistbot lets any American easily write a message to their governor. After you
[teach Resistbot to use a governor’s official web contact form](https://docs.google.com/document/d/1TAXWDPfISgRY_qESNGzfT4tFKFaDF3PPUPLK_vZI4Bs)
by writing a new `governor.yaml`, Resistbot will be able to deliver
messages immediately to that governor. You'll have made it faster and
easier for everybody to be heard in local politics.

## Directory and file structure

```
- states
  - CA
    * upper.yaml  # form config that applies for all members of California State Senate
    * lower.yaml  # for all members of California State Assembly
    * governor.yaml  # for CA governor
    * CAL000501.yaml  # e.g. if we want to use different form config for Sen. de León than other CA senators

  - TX
    * upper.yaml  # for all members of Texas State Senate
    * lower.yaml  # for all members of Texas State House of Representatives

  ... directories for other states ...

- congress
  * P000603.yaml  # for Rand Paul, Resistbot uses this intead of contact-congress/P000603.yaml
  ... configs for other Members of Congress for whom Resistbot has its own setup ...

- whitehouse
  * president.yml  # for the White House
  ... configs for other federal executives with web forms, as Resistbot adds support ...

- municipalities
  - NY
    - mayors
      # Mayor files are named for the city by convention, but the format is not strict.
      # bioguide in the config drives unique identification of the mayor.
      * new-york.yaml
      * albany.yaml

  - TX
    - mayors
      * dallas.yaml

  ... directories for other states ...
```

Notes:

- Bio IDs come from Biographical Directory of the United States Congress
  and from Open States.

- `upper` and `lower` correspond to values that `chamber`/`post.label` takes in Open States.

- We will keep `congress` directory as sparse as possible, strongly
  preferring to make changes upstream and defer to the config in `contact-congress`.

## Schema

Schema is based on [that of unitedstates/contact-congress](https://github.com/unitedstates/contact-congress/blob/master/documentation/schema.md) with these changes:

- New variables `PHONE_AREA_CODE`, `PHONE_DIGITS_ONLY`, `PHONE3`, `PHONE4`, `PHONE7`, `NAME_FULL`, `NAME_PREFIX_NO_PERIOD`, `ADDRESS_STREET_CITY_STATE`, `ADDRESS_FULL`.

- `bioguide`, `contact_form.method`, and `contact_form.action` are optional, except for mayor, where `bioguide` is _required_.

- In `fill_in` steps, `captcha_selector` can be an element enclosing text.
  The processor should strip non-word characters from beginning and end of this element's `textContent`,
  append `captcha_append_guidance` if present, and then submit this for textual
  captcha solving. See `states/FL/upper.yaml` for an example.

- In `fill_in` steps with image captchas, `captcha_image_extension` can
  optionally specify filename extension of the image, for example `png`. This
  is necessary to use if the `src` of the `img` element does not have an image
  format extension, which 2captcha requires. See `states/SC/upper.yaml`
  for an example.

- In a `success` section, instead of `body`, one can specify text that must match an alert, or one
  can specify a CSS selector for an element that must be found. See `states/WA/governor.yaml` for
  an example of the alert functionality, and `states/CA/lower.yaml` for an example of a CSS selector. You can also specify a custom `timeout` directive, in seconds, to wait for the success criteria to appear. See `states/FL/governor.yaml` for an example.

- In `recaptcha` section, a `callback` and `callback_selector` can optionally be defined. If the
  recaptcha callback is not defined in a data-callback attribute on the captcha element, its callback will
  need to be found and explicitly passed as `callback`. If the callback requires the captcha
  element be passed as a param, a selector for the element must be given as `callback_selector`. The `recaptcha` section also allows an optional `version` parameter. This is used when V3 is utilized by a form, and currently 'V3' is the only acceptable value. An optional `response_selector` can be used when the selector for the validated data is non-standard (some wpcf7 forms). At this time, the selector can be either the name attribute of a input tag, or an element ID.

- Introduction of meta variables, described below.

## Meta variables

Collectively, state legislatures are huge. Let’s look at the three most populous states plus Ohio. These are the largest states that offer web contact forms for their legislators.

- CA: 40 senators, 80 assembly members
- TX: 31 senators, 150 representatives
- FL: 40 senators, 120 representatives
- OH: 33 senators, 99 representatives

If we use one form config per bioguide, that’s 593 form config files. Moreover, if perhaps 20% of officials churn in an election cycle, that’s about 100 form config files we need to delete and 100 form config files we need to add. Worse, because the contact forms for these states’ representatives are maintained by the state, if a contact form changes, we need to update tens or hundreds of config files at once.

So it would be expedient if we can, in states with consistent forms per chamber, set up state form config files that can be used for every member of the chamber. We wouldn’t need to do anything to handle churn, since we are not hard-coding bioguides anywhere. If a contact form changes, we need to update only one config file.

Let's make it possible for form configs to reference dynamically an individual district or URL.

We introduce notion of “meta variable”, and make it possible to include `$META_VARIABLES` anywhere in the document. They will simply be replaced with the value of the variable, i.e. `config.replace('$META_OFFICIAL_DISTRICT_ZFILL', '07')`. The context must take care of quoting, if necessary.

For example, the CA senator config starts with:

```
- visit: "https://lcmspubcontact.lc.ca.gov/PublicLCMS/ContactPopup.php?district=SD$META_OFFICIAL_DISTRICT_ZFILL"
```

and the CA representative config with:

```
- visit: "https://lcmspubcontact.lc.ca.gov/PublicLCMS/ContactPopup.php?district=AD$META_OFFICIAL_DISTRICT_ZFILL"
```

The config for OH senate starts with:

```
- visit: "$META_OFFICIAL_URL"
```

Config files in `contact-officials` assume meta variables defined as
follows:

- `$META_OFFICIAL_DISTRICT`: The district of the official, or empty
  string if official holds statewide office. This corresponds to
  `district` in Open States and theunitedstates.io Congress data.

- `$META_OFFICIAL_DISTRICT_ZFILL`: District normalized such that
  single-digit district names get a leading zero, e.g. "07".

- `$META_OFFICIAL_URL`: The URL of the official homepage of the
  official. This corresponds to `url` in Open States and `url` in
  theunitedstates.io Congress data.

- `$META_OFFICIAL_LAST_SEGMENT_OF_URL`: Everything after the last slash
  in the official's URL. One can't directly visit a NJ state
  legislator's URL (e.g.
  http://www.njleg.state.nj.us/members/bio.asp?Leg=47) directly without
  being served a redirect! The only way to get to such a URL is by
  clicking on a link from e.g. the roster, which sets some server-side
  session state. This meta variable helps click on the legislator's
  link from the roster.

- `$META_OFFICIAL_STATE_LEGISLATOR_INDEX`: The index (1-indexed) of the
  official in list of the chamber legislators by alphabetical order by
  last name of state lower chamber legislators in alphabetical name.
  Even after visiting a NJ legislator's personal webpage, and clicking
  contact link, one is taken to a page that lists a district's 1 senator
  and 2 representatives, with checkboxes for each. For assemblymembers,
  the only way we can select the right checkbox here is to introduce
  this meta variable which identifies the legislator's index in this list,
  1-indexed.

- `$META_OFFICIAL_FIRST_NAME`: First name of official.

- `$META_OFFICIAL_LAST_NAME`: Last name of official.

- `$META_OFFICIAL_FULL_NAME`: Full name of official (first and
  last, separated by a space).
