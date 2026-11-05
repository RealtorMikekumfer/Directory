# Contact and description corrections

This maintenance update keeps the existing design and all 27 providers. It updates Michael's contact actions and edits descriptions in plain, practical language using the existing list and available official provider information. It does not represent a full verification of every provider's credentials, availability, or contact details.

## Michael's contact actions

- Name: Michael Kumfer.
- Email: kumferrealestate@gmail.com, in both configuration and the public HTML fallback.
- Number unchanged: (260) 354-1216.
- Michael contact actions open an SMS composer with a message identifying the Fort Wayne Home Repairs & Services Directory. A provider-specific request includes that provider's company name.
- Visitors must tap Send themselves. The site does not send automatic texts or track visits.
- Standard SMS body parameters are used, with Apple's Messages delimiter handled separately. Actual delivery depends on the visitor having a configured messaging app. Email remains available.

## Confirmed corrections

| Entry | Change | Evidence |
| --- | --- | --- |
| Bone Dry Roofing | Replace reserved placeholder (260) 555-0128 with (260) 267-6189; update office ZIP to 46808. | [Official Fort Wayne location page](https://bonedry.com/fort-wayne/) and [Fort Wayne HBA listing](https://business.hbafortwayne.com/member-directory/Details/bone-dry-roofing-4562042). The general locations page lists a different routing number; the local office page and HBA agree on the chosen number. |
| Environmental Management Specialists | Replace info@emsclean.com with info@ems-us.net. | [Official contact page](https://www.ems-us.net/contact/), which also matches the existing (260) 637-9414 number. |
| VSI Home Lending | Correct Dave Gibbson to Dave Gibson; replace the street-location fragment in Service_Area with Fort Wayne area. | [Official staff profile](https://www.vsihomelending.com/StaffProfiles?ID=801162), which matches the existing email and phone. |
| Approved Mortgage | Remove the extra e in Approved Mortgagee. | [Official team page](https://approvedmortgage.com/about-us/our-team/) lists Adam Quaintance. His supplied direct phone and email are retained. |
| Independent Roofing Contractor | Correct spelling of Independent. | Spelling correction only; no claim that this is a verified registered business name. |

Existing saved-contact IDs and shared-link IDs are retained for renamed entries through the optional `ID` field. The owner editor preserves that field when editing an existing entry. Leave it unchanged when updating a contact's display name.

## Descriptions and notes

- Correct spelling, capitalization, punctuation, and sentence structure throughout the provider descriptions and notes.
- Move water/radon/mold testing from the directory note into the services description for Your Environmental Services.
- Remove unverified rankings, star-rating claims, project counts, absolute promises, and broad licensing/insurance claims. Do not expand the list into guarantees about price, approval, savings, or service availability.
- Keep personal recommendations grounded in the original notes, without inventing new experiences.
- Describe current loan options generally and direct visitors to the lender for details.
- Keep existing categories and internal rating values unchanged. The app still derives Handyman and Insurance categories as before.

## Contact-check limits

Available official sources corroborated several existing contacts, including [Titus](https://tselectric.jobbersites.com/), [Brick by Brick's inspector listing](https://www.nachi.org/certified-inspectors/michael-foust-179991), [Intteg](https://www.intteghomeinspection.com/), [Best Contracting](https://bestcontractingplumbingservices.com/), [T&D](https://www.tdservicesolutions.com/about-t-d), [North Side Plumbing](https://www.northsideplumbingfw.com/contact/), [Diamond Homescapes](https://www.diamondhomescapes.com/contact-us/), and [Spade Heating](https://www.toddspade.com/). These checks do not establish email deliverability or that every personal mobile number is current.

Where no clear official confirmation was available, supplied personal contact details were retained rather than replaced with a guessed address or a different office number. Steve's still has no direct contact details; visitors are directed to text Michael about that provider. No calls, emails, or texts were sent during verification.

## Validation

- Existing checks plus regression checks for SMS message encoding, standard/Apple URL forms, invalid and placeholder phone rejection, email trimming, and retained contact IDs.
- All populated provider phone/email fields pass format validation. All 27 entries have a service description.
- Local browser checks cover contact destinations, provider context, saving/unsaving a renamed contact, search, and mobile layout.
- SMS delivery and the external messaging app's behavior cannot be verified in the desktop browser; the prefilled links are checked without sending a text.
