import { Timestamp } from "firebase/firestore";

const dummyData = [
  {
    enrollment: {
      code: ["CS 194W"],
      schedules: [
        {
          component: "LEC",
          days: [
            "Monday",
            "Wednesday",
            "Friday",
          ],
          startInfo: {
            nanoseconds: 0,
            seconds: 1648460700,
          },
          endInfo: {
            nanoseconds: 0,
            seconds: 1654080300,
          },
        },
        {
          component: "DIS",
          days: [
            "Tuesday",
            "Thursday"
          ],
          startInfo: {
            nanoseconds: 0,
            seconds: 1648425600,
          },
          endInfo: {
            nanoseconds: 0,
            seconds: 1654041600,
          },
        },
      ]
    },
    friends: [
      {
        id: "vkk5ngcfnYgjCMDqXb65YZtpquM2",
        name: "Jiwon Lee",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Melissa Daniel",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      }
    ]
  },
  {
    enrollment: {
      code: ["CS 106B"],
      schedules: [
        {
          component: "LEC",
          days: [
            "Monday",
            "Wednesday",
            "Friday",
          ],
          startInfo: {
            nanoseconds: 0,
            seconds: 1648460700,
          },
          endInfo: {
            nanoseconds: 0,
            seconds: 1654080300,
          },
        },
        {
          component: "DIS",
          days: [
            "Tuesday",
            "Thursday"
          ],
          startInfo: {
            nanoseconds: 0,
            seconds: 1648425600,
          },
          endInfo: {
            nanoseconds: 0,
            seconds: 1654041600,
          },
        },
      ]
    },
    friends: [
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Jiwon Lee",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Melissa Daniel",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Grace Alwan",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Tara Jones",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Melanie Kessinger",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Melanie Kessinger",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Tara Jones",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Melanie Kessinger",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Melanie Kessinger",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
    ]
  },
  {
    enrollment: {
      code: ["CS 278"],
      schedules: [
        {
          component: "LEC",
          days: [
            "Monday",
            "Wednesday",
            "Friday",
          ],
          startInfo: {
            nanoseconds: 0,
            seconds: 1648460700,
          },
          endInfo: {
            nanoseconds: 0,
            seconds: 1654080300,
          },
        },
        {
          component: "DIS",
          days: [
            "Tuesday",
            "Thursday"
          ],
          startInfo: {
            nanoseconds: 0,
            seconds: 1648425600,
          },
          endInfo: {
            nanoseconds: 0,
            seconds: 1654041600,
          },
        },
      ]
    },
    friends: [
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Jiwon Lee",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Melissa Daniel",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Grace Alwan",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Tara Jones",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Melanie Kessinger",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
      {
        id: "6K90G2P5LbT54j29CShLJC0IqdO2",
        name: "Melanie Kessinger",
        major: "Computer Science",
        gradYear: "2022 (Senior)",
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
      },
    ]
  },
]

export default dummyData;
