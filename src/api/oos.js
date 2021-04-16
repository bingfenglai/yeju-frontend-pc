import request from '@/utils/request'
import SparkMD5 from "spark-md5";
// 上传方法
export function upload(file){
  let formData = new FormData()
  formData.append('filePart',file)

  return request({
    url : 'yeju-all-rest-api/oos/upload',
    method: 'POST',
    headers : {
      'Content-Type': 'multipart/form-data'
    },
    data : formData
  })

}


export function checkMd5(fileMd5){
  return request({
    url: 'yeju-all-rest-api/oos/'+fileMd5,
    method: 'GET',
  })
}

 export function getFileMd5(file,callback){
   let fileReader = new FileReader();
   let spark = new SparkMD5.ArrayBuffer();

   // 获取文件二进制数据
   fileReader.readAsArrayBuffer(file);

   fileReader.onload = function (e) {
     spark.append(e.target.result);
     callback(spark.end())
   };
 }
