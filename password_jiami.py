import requests
import sys
sys.stdout.reconfigure(encoding='utf-8')
# js_code = """
# (function(){
#     console.log("test")
#     return "执行成功"
# })()
# """
#
# url = "http://localhost:12080/execjs"
# data = {
#     "group": "zzz",
#     "code": js_code
# }
# res = requests.post(url, data=data)
# print(res.text)

import json

url = "http://127.0.0.1:12080/go"
data = {
    "group": "weibo",
    "action": "password_jiami",
    "param": json.dumps({'password': 2222})
}
print(data["param"]) #dumps后就是长这样的字符串{"user": "\u9ed1\u8138\u602a", "status": "\u597d\u56f0\u554a"}
res=requests.post(url, data=data) #这里换get也是可以的
print(res.text)
# resp = requests.get("http://127.0.0.1:12080/page/html?group=zzz")     # 直接获取当前页面的html
# resp = requests.get("http://127.0.0.1:12080/page/cookie?group=zzz")   # 直接获取当前页面的cookie
# print(resp)
