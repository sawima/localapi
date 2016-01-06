$('#location_gallery').fileupload({
    dataType:'json',
    url:'/upload/location',
    autoUpload: true,
    sequentialUploads:true,
    progressall:function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#gallery_progress .bar').css('width', progress + '%');
    },
    filesContainer:$('#upload_gallery_files'),
    uploadTemplate:function (o) {
        var rows = $();
        $.each(o.files, function (index, file) {
            var row = $('<li class="template-upload">' +
                '<div class="outer"><div class="preview"><span class="fade"></span></div>' +
                '<span class="cancel"><button type="button">Delete</button></span>' +
                '<span class="name"></span>' +
                '<span class="size"></span>' +
                (file.error ? '<span class="error">Error</span>' :
                    '<p><div class="progress">' +
                        '<div class="bar" style="width:0%;"></div></div></p>' +
                        '<span class="start"><button type="button">Send</button></span>') +
                '</div></li>');
            row.find('.name').text(file.name);
            row.find('.size').text(o.formatFileSize(file.size));
            if (file.error) {
                row.find('.error').text(file.error || 'File upload error');
            }
            rows = rows.add(row);
        });
        return rows;
    },
    downloadTemplate: function (o) {
        var rows = $();
        $.each(o.files, function (index, file) {
            var row = $('<li class="template-download">' +
                '<div class="outer">' +
                (file.error ? '<span class="name"></span>' +
                    '<span class="size"></span><span class="error"></span>' :
                    '<div class="preview"></div>' +
                        '<span class="name"><a></a></span>' +
                        ' [<span class="size"></span>]') +
                '<span class="delete"><button type="button">Delete</button></span></div></li>');
            row.find('.size').text(o.formatFileSize(file.size));
            if (file.error) {
                row.find('.name').text(file.name);
                row.find('.error').text(file.error || 'File upload error');
            } else {
                row.find('.name a').text(file.name);
                if (file.url) {
                    row.find('.preview').append('<a><img></a>')
                        .find('img').prop('src', file.smallUrl);
                    row.find('a').prop('rel', 'gallery');
                }
                row.find('a').prop('href', file.url);
                row.find('.delete')
                    .attr('data-type', file.delete_type)
                    .attr('data-url', file.deleteUrl);
                // add file data input
                row.append('<input type="hidden" name="attachments[]">')
                    .find('input[name="attachments[]"]').val(file.name);
                row.find('img').data('fileinfo',file);
            }
            rows = rows.add(row);
        });
        return rows;
    }
});