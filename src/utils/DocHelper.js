export function getExternalDocUrl(vm, topic) {
  let locale = vm.$i18n.locale;
  if (locale.startsWith("zh")) {
    return vm.$docRootURL + "bcs-doc:" + topic;
  } else {
    return vm.$docRootURL + locale + ":bcs-doc:" + topic;
  }
}

export const PlaceholderImage = "/img/landscape_placeholder.png";
