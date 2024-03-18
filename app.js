var bs_modal = $("#modal");
var image = document.getElementById("employee-image");
var cropper, reader, file;

$("body").on("change", ".employee-image", function (e) {
  var files = e.target.files;
  var done = function (url) {
    image.src = url;
    bs_modal.modal("show");
  };

  if (files && files.length > 0) {
    file = files[0];

    if (URL) {
      done(URL.createObjectURL(file));
    } else if (FileReader) {
      reader = new FileReader();
      reader.onload = function (e) {
        done(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
});

bs_modal
  .on("shown.bs.modal", function () {
    cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 2,
      preview: ".preview",
    });
  })
  .on("hidden.bs.modal", function () {
    cropper.destroy();
    cropper = null;
  });

$("#crop").click(function () {
  canvas = cropper.getCroppedCanvas({
    width: 260,
    height: 260,
  });

  canvas.toBlob(function (blob) {
    url = URL.createObjectURL(blob);
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      if (base64data.startsWith("data:")) {
        const timestamp = new Date().getTime();
        const filename = `image_${timestamp}_${Math.floor(
          Math.random() * 10000
        )}.png`;
        let base64Data = base64data.replace(/^data:image\/\w+;base64,/, "");
        let buffer = new Uint8Array(
          atob(base64Data)
            .split("")
            .map((c) => c.charCodeAt(0))
        );
        let file = new File([buffer], filename, { type: "image/png" });
        console.log(file);
      }
    };
  });
});
