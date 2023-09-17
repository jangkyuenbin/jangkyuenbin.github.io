import os
i=1
while True:
    if os.path.exists('./stream.jpg'):
        while os.path.exists('./{}.jpg'.format(i)):
            i+=1
        print('./{}.jpg'.format(i))
        os.rename('./stream.jpg', './{}.jpg'.format(i))
        i+=1
        