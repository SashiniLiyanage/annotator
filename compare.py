# Import Module
import os

# Folder Path
path = r"c:\Users\WSO2\Downloads\compare"

# Change the directory
os.chdir(path)


def read_text_file(file_path):
	with open(file_path, 'r') as f:
		return f.read()

# Read text File
file_path = r"c:\Users\WSO2\Documents\SashiniLiyanage\annotator\original_coco.json"
original = read_text_file(file_path)
	
print("")

# iterate through all file
for file in os.listdir():
	# Check whether file is in text format or not
    if file.endswith("coco.json"):
        file_path = f"{path}\{file}"
        content = read_text_file(file_path)
        if(content != original):
            print("different - ",file)
        else:
            print("same")
		
print("")