import random
import config
import Util
from copy import deepcopy

class LinearGenotype():
    def __init__(self):
        self.tempo = 0
        self.sounds = []
        self.soundTimes = dict()
        self.loopLength = 0

    def random_initialization(self, sounds):

        pass


    def recombine(self, mate):
        child = LinearGenotype()



        for i in range(0, len(self.genes)):
            childGenes.append(self.genes[i] if random.random() < 0.5 else mate.genes[i])

        child.genes = deepcopy(childGenes)

        return child


    def mutate(self, bounds, bonus=None, **kwargs):
        mutant = LinearGenotype()
        mutant.genes = deepcopy(self.genes)
        
        for i in range(0, len(mutant.genes)):
            for j in range(0, len(mutant.genes[i])):
                if random.random() < kwargs["mutation_chance"]:
                    if j < 2:
                        newVal = mutant.genes[i][j] + round(random.gauss(0, bounds[j][1] / 4))
                        mutant.genes[i][j] = min(bounds[j][1] - 1, max(bounds[j][0], newVal))
                    else:
                        mutant.genes[i][j] = random.randrange(0, 4)

        return mutant


    @classmethod
    def initialization(cls, mu, *args, **kwargs):
        population = [cls() for _ in range(mu)]
        for i in range(len(population)):
            population[i].random_initialization(*args, **kwargs)
        return population