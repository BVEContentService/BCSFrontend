<template>
  <v-tabs color="blue">
    <v-tab href="#tab-1">{{ $t("t_htmleditor_wysiwyg") }}</v-tab>
    <v-tab href="#tab-2" @change="updateCodeMirror">
      {{ $t("t_htmleditor_codemirror") }}
    </v-tab>
    <v-tab href="#tab-3">{{ $t("t_htmleditor_preview") }}</v-tab>
    <v-tab-item value="tab-1" :eager="true">
      <ckeditor
        v-model="internal_html"
        :editor="editor"
        :config="editorConfig"
        ref="ckeditor"
      ></ckeditor>
    </v-tab-item>
    <v-tab-item value="tab-2" :eager="true">
      <codemirror
        ref="codemirror"
        v-model="internal_html"
        :options="{
          mode: 'htmlmixed',
          tabSize: 2,
          viewportMargin: Infinity,
          lineNumbers: true,
          line: true,
          lineWrapping: true
        }"
      ></codemirror>
    </v-tab-item>
    <v-tab-item value="tab-3" :eager="true">
      <div class="pl-2 pr-2" v-html="internal_html"></div>
    </v-tab-item>
  </v-tabs>
</template>

<style>
.CodeMirror {
  border: 1px solid #aaa;
  height: auto;
}
.CodeMirror-wrap pre {
  word-break: break-word;
}
.ck.ck-sticky-panel .ck.ck.ck-sticky-panel__content_sticky {
  top: 48px !important;
}
.ck-content .image {
  margin: 0 !important;
}
</style>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { uploadImage } from "../utils/ImgChr.js";
import { handleNetworkErr } from "../utils/ErrorHelper.js";

export default {
  name: "html-editor",
  components: {
    codemirror,
    // Use the <ckeditor> component in this view.
    ckeditor: CKEditor.component
  },
  watch: {
    internal_html(newValue) {
      this.$emit("update:html", newValue);
    }
  },
  data: function() {
    return {
      editor: ClassicEditor,
      editorConfig: {},
      internal_html: this.html
    };
  },
  methods: {
    updateCodeMirror() {
      setTimeout(() => {
        this.$refs.codemirror.codemirror.refresh();
      }, 50);
    },
    insertImageFile() {
      var editor = this.$refs.ckeditor.instance;
      var fileSelector = document.createElement("input");
      fileSelector.type = "file";
      fileSelector.onchange = e => {
        var file = e.target.files[0];
        this.$dialog.message.warning(this.$i18n.t("t_toast_uploading"), {
          position: "top-right"
        });
        uploadImage(this, file)
          .then(function(result) {
            const viewFragment = editor.data.processor.toView(
              '<img src="' +
                encodeURI(result.full_url) +
                '" style="max-width:100%" />'
            );
            const modelFragment = editor.data.toModel(viewFragment);
            editor.model.insertContent(modelFragment);
          })
          .catch(function(ex) {
            handleNetworkErr(ex, this);
          });
      };
      fileSelector.click();
    },
    insertImageURL() {
      var editor = this.$refs.ckeditor.instance;
      var url = prompt(this.$i18n.t("t_htmleditor_image_prompt"));
      if (url != null) {
        const viewFragment = editor.data.processor.toView(
          '<img src="' + encodeURI(url) + '" style="max-width:100%" />'
        );
        const modelFragment = editor.data.toModel(viewFragment);
        editor.model.insertContent(modelFragment);
      }
    }
  },
  mounted() {
    setTimeout(() => {
      const imageSVG =
        "M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 " +
        "0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 " +
        ".59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 " +
        "5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z";
      const mediaSVG =
        "M18.68 3.03c.6 0 .59-.03.59.55v12.84c0 .59.01.56-.59.56H1.29c-.6 " +
        "0-.59.03-.59-.56V3.58c0-.58-.01-.55.6-.55h17.38zM15.77 15V5H4.2v10h11.57zM2 4v1h1V4H2zm0 " +
        "2v1h1V6H2zm0 2v1h1V8H2zm0 2v1h1v-1H2zm0 2v1h1v-1H2zm0 2v1h1v-1H2zM17 4v1h1V4h-1zm0 2v1h1V6h-1zm0 " +
        "2v1h1V8h-1zm0 2v1h1v-1h-1zm0 2v1h1v-1h-1zm0 2v1h1v-1h-1zM7.5 7.177a.4.4 0 01.593-.351l5.133 2.824a.4.4 " +
        "0 010 .7l-5.133 2.824a.4.4 0 01-.593-.35V7.176v.001z";
      var ckSvgs = document.getElementsByClassName(
        "ck ck-icon ck-button__icon"
      );
      var firstImgBtn;
      for (var i = 0; i < ckSvgs.length; i++) {
        if (ckSvgs[i].firstChild.getAttribute("d") == imageSVG) {
          let ckBtn = ckSvgs[i].parentElement;
          ckBtn.children[1].firstChild.innerHTML = this.$i18n.t(
            "t_htmleditor_image_url"
          );
          let newBtn = ckBtn.cloneNode(true);
          ckBtn.parentNode.replaceChild(newBtn, ckBtn);
          firstImgBtn = newBtn;
          newBtn.addEventListener("click", this.insertImageURL, false);
        } else if (ckSvgs[i].firstChild.getAttribute("d") == mediaSVG) {
          ckSvgs[i].firstChild.setAttribute("d", imageSVG);
          let ckBtn = ckSvgs[i].parentElement;
          ckBtn.lastChild.setAttribute("transform", "rotate(180)");
          ckBtn.children[1].firstChild.innerHTML = this.$i18n.t(
            "t_htmleditor_image_file"
          );
          let newBtn = ckBtn.parentNode.cloneNode(true);
          ckBtn.parentNode.parentNode.insertBefore(
            newBtn,
            firstImgBtn.parentNode.nextSibling
          );
          ckBtn.parentNode.removeChild(ckBtn);
          newBtn.addEventListener("click", this.insertImageFile, false);
        }
      }
    }, 50);
  },
  props: ["html"]
};
</script>
