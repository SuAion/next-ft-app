'''
Author: Jiang ShaoDong
Email: jiangshaodong@everimaging.com
Date: 2020-09-17 17:26:26
Description: 
'''
import json
import os.path
import pandas as pd

def write_json(dir, file_name, data):

    with open(dir + '/' + file_name, 'w', encoding='UTF-8') as outfile:
        json.dump(data, outfile, ensure_ascii=False, sort_keys=True, indent=4, separators=(',', ': '))

dir_path = os.path.dirname(os.path.realpath(__file__))

filepath = dir_path + '/en_US.json'

output_dir = dir_path + '/'

mapping_headers = { 
  "en_US": "英文/en_US", 
  "zh_CN": "中文/zh_CN", 
  "zh_TW": "繁体/zh_TW", 
  "ja_JP": "日语/ja_JP", 
  "es_ES": "西班牙语/es_ES", 
  "pt_BR": "葡萄牙语/pt_BR", 
  "ru_RU": "俄语/ru_RU", 
  "fr_FR": "法语/fr_FR", 
  "de_DE": "德语/de_DE", 
}
# output_languages
output_languages = ["en_US", "zh_CN", "zh_TW", "ja_JP", "es_ES", "pt_BR", "ru_RU", "fr_FR", "de_DE"]

output_lang_values = {}

with open(filepath,'r', encoding='UTF-8') as json_file:

    json_obj = json.load(json_file)

    # setup output languages
    for lang in output_languages:
        output_lang_values[lang] = dict(json_obj)

    # print(json_obj)


excel_file_path = dir_path + '/fotor 社区多语言文档.xlsx'

xl_file = pd.ExcelFile(excel_file_path)

dfs = [xl_file.parse(sheet_name)
           for sheet_name in xl_file.sheet_names]


for df in dfs:
    for index, row in df.iterrows():
        key_in_excel = row.get('key')
        if key_in_excel is None:
            key_in_excel = row.get('Key')
        if key_in_excel != "" and not pd.isnull(key_in_excel):
            key_in_excel = key_in_excel.strip()
            for key, value in output_lang_values.items():
                ex_column = mapping_headers[key]
                # print(row)
                # if key_in_excel == 'dailog_share_cn_type_weibo':
                #     print('key:', key, row)
                # if key_in_excel == 'left_sidebar_setting_guide':
                #     print('key:', key_in_excel)

                if not pd.isnull(row[ex_column]):
                    # 将不间断空格替换为普通空格
                    msg = str(row[ex_column]).replace("\u00A0", " ") 
                    value[key_in_excel] = msg
                else:
                  value[key_in_excel] = ''

# print('output_lang_values', output_lang_values)
for key, value in output_lang_values.items():
    write_json(output_dir, key + '.json', value)

