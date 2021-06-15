from PIL import Image
import numpy
from keras.models import load_model
model = load_model('catvsdog.h5')

#dictionary to label all traffic signs class.
classes = { 
    0:'its a cat',
    1:'its a dog',
 
}
file_path = "test.jpg"

image = Image.open(file_path)
image = image.resize((128,128))
image = numpy.expand_dims(image, axis=0)
image = numpy.array(image)
image = image/255
pred = model.predict_classes([image])[0]
sign = classes[pred]
print(sign)
