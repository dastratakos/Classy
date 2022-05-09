
const functions = require("firebase-functions");
const axios = require("axios");
const {parseString} = require("xml2js");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

const {AUTUMN, WINTER, SPRING, SUMMER} = require("./filters");

const URL = "https://explorecourses.stanford.edu/";

exports.getAllCourses = functions.firestore
    .document("test/{docId}")
    .onCreate((snap, context) => {
      const academicYear = "2021-2022";

      const params = {
        view: "xml",
      };
      if (academicYear) params.year = academicYear.replace(/-/g, "");

      axios({method: "GET", url: URL, params})
          .then((res) => {
            const schools = parseXML(res.data).schools.school;

            const filters = [AUTUMN, WINTER, SPRING, SUMMER];

            for (const school of schools) {
              // console.log("school:", school.$.name);
              for (const dept of school.department) {
                // console.log("dept:", dept.$.name);
                const code = dept.$.name;
                getCoursesByDepartment(code, filters, academicYear);
              }
            }
          })
          .catch((error) => {
            console.log("Failed to query ExploreCourses");
            console.log(error);
            return null;
          });

      return snap.ref.delete();
    });

/**
 * Parses a string into an XML object.
 * @param {string} data The data to parse.
 * @return {Object} The XML object.
 */
function parseXML(data) {
  let result = null;
  parseString(data, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    // console.log("parsed:", JSON.stringify(res, null, 2));
    result = res;
  });

  return result;
}

/**
 * Gets all of the schools for a particular year.
 * @param {string} academicYear The year to search for (e.g. "2021-2022").
 * @return {Object} An Object containing all the schools.
 */
function getSchools(academicYear=null) {
  const params = {
    view: "xml",
  };
  if (academicYear) params.year = academicYear.replace(/-/g, "");

  return axios({method: "GET", url: URL, params})
      .then((res) => {
        return parseXML(res.data.schools.school);
      })
      .catch((error) => {
        console.log("Failed to query ExploreCourses");
        console.log(error);
        return null;
      });
}

const getCoursesByDepartment = (code, filters, year=null) => {
  const newFilters = [...filters];
  newFilters.push(`filter-departmentcode-${code}`);

  return getCoursesByQuery(code, newFilters, year);
};

const getCoursesByQuery = (query, filters, year=null) => {
  const params = {
    view: "xml",
    q: query,
  };
  params["filter-corusestatus-Active"] = "on";
  filters.forEach((f) => {
    params[f] = "on";
  });
  if (year) params.academicYear = year.replace(/-/g, "");

  // console.log("params:", params);

  axios({method: "GET", url: URL + "search", params})
      .then((res) => {
        // console.log("data:", res.data);
        const courses = parseXML(res.data).courses.course;
        // console.log("parsed course:", JSON.stringify(parsedData, null, 2));

        courses.forEach((course) => {
          const courseObj = {
            code: course.subject[0] + " " + course.code[0],
            title: course.title[0],
            description: course.description[0],
            gers: course.gers[0],
          };

          // TODO: administrativeInformation!!
          // TODO: sections

          db.collection("courses").add(courseObj);
        });
      })
      .catch((error) => {
        console.log("Failed to query ExploreCourses");
        console.log(error);
      });
};
