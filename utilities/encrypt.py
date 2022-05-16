from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from base64 import b64decode
from base64 import b64encode
import sys

def rsa_encrypt(s, public_key):
    key = b64decode(public_key)
    key = RSA.importKey(key)

    cipher = PKCS1_v1_5.new(key)
    ciphertext = b64encode(cipher.encrypt(bytes(s).encode('utf-8')))
    print(str(ciphertext).decode("utf-8"))


    return ciphertext


rsa_encrypt(sys.argv[1], sys.argv[2])