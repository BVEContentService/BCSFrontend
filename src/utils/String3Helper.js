export function s3(s3, isEnglish) {
  if (s3.Local && s3.English) {
    return isEnglish ? s3.English : s3.Local;
  } else if (s3.English) {
    return s3.English;
  } else if (s3.Local) {
    return s3.Local;
  } else {
    return "";
  }
}
