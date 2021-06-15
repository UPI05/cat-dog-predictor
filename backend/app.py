from flask import Flask, jsonify, request
import os
import json

from PIL import Image
import numpy
from keras.models import load_model
model = load_model('catvsdog.h5')

# dictionary to label all traffic signs class.
classes = {
    0: 'Its a cat',
    1: 'Its a dog',

}

app = Flask(__name__)


@app.route('/')
def index():
    return "Welcome to Cat-Dog predictor API"


@app.route('/catdogpredictorapi/v1.0/predict', methods=['POST'])
def predict():
    file = request.files['file']
    f_name = file.filename
    if (f_name == '' or not file):
        return ({'res': 'File not found!'})
        
    file.save(f_name)

    image = Image.open(f_name)
    image = image.resize((128, 128))
    image = numpy.expand_dims(image, axis=0)
    image = numpy.array(image)
    image = image / 255
    pred = model.predict_classes([image])[0]
    sign = classes[pred]
    if os.path.exists(f_name):
    	os.remove(f_name)
    return json.dumps({'res': sign})


if __name__ == '__main__':
    app.run(debug=True)
