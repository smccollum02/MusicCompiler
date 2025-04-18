# Util.py
import math
import random
def getGaussDistSelection(mean, stdDev):
    x = random.random()
    return (1 / (stdDev * math.sqrt(2.0 * math.pi))) * math.exp(-0.5 * math.pow((x - mean) / stdDev, 2))