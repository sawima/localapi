module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin:{
        	options: {
            keepSpecialComments: 0
          },
          compress: {
            files: {
              "public/css/dist/huitian.min.css": 
                [
                   "public/css/app.css",
                   "public/css/blocks.css",
                   "public/css/custom.css",
                   "public/css/plugins.css",
                   "public/css/red.css",
                   "public/css/style.css",
                   "public/css/footers/footer-v2.css",
                   "public/css/headers/header-default.css",
                   "public/css/plugins/line-icons.css",
                   "public/css/plugins/owl.carousel.css",
                   "public/css/plugins/owl.theme.css",
                   "public/css/plugins/line-icons.css",
                   "public/css/plugins/revolution-slider.css"
              ]
            }
          }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-cssmin');


    grunt.registerTask('default', ['cssmin']);
}