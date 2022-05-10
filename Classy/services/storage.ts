import { auth, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

/**
 * From https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js.
 */
export const uploadImage = async (dest: string, uri: string) => {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(storage, dest);
  const result = await uploadBytes(fileRef, blob)
    .then(() => console.log("Successfully uploaded bytes"))
    .catch((error) => console.log(error.message));

  // We're done with the blob, close and release it
  blob.close();

  return await getDownloadURL(fileRef);
};
