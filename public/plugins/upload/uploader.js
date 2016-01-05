Uploader = {
  // info: [],
  uploadUrl: '/upload',
  cancelUpload: function(e) {
    e.preventDefault();

    debugger;
    var upload = e.currentTarget.form.uploadData.upload;
    if (upload!= null) {
      upload.abort();
    }
  },
  // render: function(targetPath,staticHost) {
  render: function() {

    // Change this to the location of your server-side upload handler:
    // var data = {};
    var data=this.data;
    // data.targetPath=targetPath;
    // data.staticHost=staticHost;
    data.picker = this.$('.uploadFilePicker');
    data.progress = this.$('.uploadProgressHolder');
    data.progressBar = this.$('.uploadProgressBar');
    data.progressLabel = this.$('.uploadProgressLabel');
    data.result=this.$('.kima_upload_result');

    // init info array
    // this.info=[];

    // remember on form the data we are sending
    this.find('form').uploadData = data;

    this.$('.upload').fileupload({
      url: Uploader.uploadUrl,
      dataType: 'json',
      add: function (e, data) {

        // get the upload data from the form
        var uploadData = data.form[0].uploadData;
        data.formData = {
          contentType: uploadData.targetPath
        };

        // set the info variable
        // Uploader.info.set(data.files);
        // this.info=data.files;
        // modify controls
        uploadData.picker.hide('slow');
        uploadData.progress.show('slow');

        // remember the xhr
        uploadData.upload = data.submit()
          //.success(function (result, textStatus, jqXHR) {  })
          .error(function (jqXHR, textStatus, errorThrown) {
            if (errorThrown === 'abort') {
              uploadData.picker.show('slow');
              uploadData.progress.hide('slow');
            }
          })
        //.complete(function (result, textStatus, jqXHR) {
        //  alert('Done!');
        //});
      },
      done: function (e, data) {
        var uploadData = data.form[0].uploadData;
        var filePath=uploadData.staticHost+uploadData.targetPath+"/"+data.result.files[0].name;
        uploadData.result.append("<li><a target='_blank' href='"+filePath+"'>"+data.result.files[0].name+"</a></li>");//////add element to UI
        $.each(data.result.files, function (index, file) {
          Uploader.finished(index, file);
          uploadData.picker.show('fast');
          uploadData.progress.hide('fast');
        });
      },
      progressall: function (e, data) {
        //uploadData = data;
        var progress = parseInt(data.loaded / data.total * 100, 10);

        e.target.form.uploadData.progressBar.css(
          'width',
          progress + '%'
        );
        e.target.form.uploadData.progressLabel.html(bytesToSize(data.loaded) + "/" +
        bytesToSize(data.total) + "&nbsp;@&nbsp;" + bytesToSize(data.bitrate) + "&nbsp;/&nbsp;sec");
      }
    })
      .prop('disabled', !$.support.fileInput)
      .parent().addClass($.support.fileInput ? undefined : 'disabled');
  },
  finished: function() {}
}

function bytesToSize(bytes) {
  if (bytes == 0) return '0 Byte';
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + '&nbsp;' + sizes[i];
}