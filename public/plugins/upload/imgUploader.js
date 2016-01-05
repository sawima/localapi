ImgUploader = {
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
    var data=this.data;

    data.result=this.$('#kima_img_upload_result');
    data.kimatargetpic=this.$('#kima_target_pic');
    data.kimatargetPath=this.$('#kima_target_file');


    this.find('form').uploadData = data;
    // this.$('#picUpload_Form').uploadData = data;

    this.$('.upload').fileupload({
      url: Uploader.uploadUrl,
      dataType: 'json',
      add: function (e, data) {

        // get the upload data from the form

        console.log(data);
        var uploadData = data.form[0].uploadData;
        data.formData = {
          contentType: uploadData.targetPath
        };
        // remember the xhr
        uploadData.upload = data.submit();
      },
      done: function (e, data) {
        var uploadData = data.form[0].uploadData;
        var filePath=uploadData.staticHost+uploadData.targetPath+"/"+data.result.files[0].name;
        uploadData.result.empty();
        uploadData.result.append("<li><a target='_blank' href='"+filePath+"'>"+data.result.files[0].name+"</a></li>");//////add element to UI
      	uploadData.kimatargetPath.val(filePath);
      	$.each(data.result.files, function (index, file) {
          // ImgUploader.finished(index, file);
        });


      	uploadData.kimatargetpic.attr("src",filePath);
      }
    })
      .prop('disabled', !$.support.fileInput)
      .parent().addClass($.support.fileInput ? undefined : 'disabled');
  },
  finished: function(index,file) {
  	// console.log('upload finished');
  	// console.log(file);
  }
}