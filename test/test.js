var expect                = require("chai").expect
  , path                  = require("path")
  , _                     = require("lodash")
  , NoTemplateDataError   = require("../build/errors/NoTemplateDataError");


describe("Temail", function() {
// 
//   describe("When instantiating", function() {
//     it("errors out with an error message containing 'Cannot find module... <name of module>' when the `data` path refers to a file which does not exist.", function() {
//       expect(function() {
//         new Temail({
//           data: path.resolve(__dirname, "does-not-exist.json")
//         });
//       }).to.throw(/Cannot find module.*does-not-exist.json.*/);
//     });
//     it("throws a NoTemplateDataError if the `to` array contains an email address for which there is no corresponding key in the data JSON file.", function() {
//       expect(function() {
//         new Temail({
//           data: path.resolve(__dirname, "data/john-and-jane-doe.json"),
//           // jackblack@gmail.com is not present as a key in the JSON file ./data/john-and-jane-doe.json
//           to: ["johndoe@gmail.com", "jackblack@gmail.com"]
//         });
//       }).to.throw(NoTemplateDataError);
//     });
//   });

});
