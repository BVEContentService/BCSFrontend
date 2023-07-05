export async function uploadImage(vm, file) {
  const imgChrBaseURL = "https://storage.zbx1425.cn/img-lsky/api/v1/upload";
  let formData = new FormData();
  formData.append("file", file);
  formData.append("strategy_id", "1");
  let jsonResponse = await vm.$http({
    method: "post",
    url: imgChrBaseURL,
    data: formData,
    headers: {
      Authorization: "NONE"
    }
  });
  if (jsonResponse.data.status) {
    return {
      full_url: jsonResponse.data.data.links.url,
      thumb_url: jsonResponse.data.data.links.thumbnail_url
    };
  } else {
    return {
      full_url: jsonResponse.data.message,
      thumb_url: ""
    };
  }
}

/*
uploadImage(vm, file) {
  const imgChrBaseURL = "https://hbb.zbx1425.cn:8953/imgchr/";
  let homeResponse = await vm.$http.get(imgChrBaseURL, {
    withCredentials: true
  });
  let auth_token = homeResponse.data.match(
    /PF\.obj\.config\.auth_token = "(.*)"/
  )[1];
  let formData = new FormData();
  formData.append("source", file);
  formData.append("type", "file");
  formData.append("action", "upload");
  formData.append("timestamp", new Date().getTime());
  formData.append("auth_token", auth_token);
  formData.append("nsfw", 0);
  let jsonResponse = await vm.$http({
    method: "post",
    url: imgChrBaseURL + "json",
    data: formData,
    withCredentials: true
  });
  return {
    full_url: jsonResponse.data.image.image.url,
    thumb_url: jsonResponse.data.image.thumb.url
  };
}
*/
