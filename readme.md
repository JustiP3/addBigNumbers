Adds big numbers

Screenshot:
![Demo](demo.png)

TODO:
-fix bugs
-make content centered
-make wordform variation in spanish
-account for bigger numbers than quadrillion
-cleanse inputs for non-number inputs
-cleanse inputs for preceeding 0's (e.g. 00000005)
-refactor addbignumbers and arrayadd - the interplay doesn't really make sense as it is now

Bugs to be fixed:
wordForm
if 000 in any group of three we still display the suffix which is wrong (e.g. 1,000,123 => one million thousand one hundred twenty-three)
7
