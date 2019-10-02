import unittest
import random

from PIL import Image as pil
import numpy as np

import funcs


class QuickSortTest(unittest.TestCase):

    def setUp(self):
        self.arr = [random.randint(1, 50) for i in range(20)]

    def test_quick_test(self):

        length = len(self.arr)
        self.assertEqual(funcs.quickSort(
            self.arr, 0, length - 1), self.arr.sort())


class ImageManipulationTests(unittest.TestCase):

    def setUp(self):

        self.image_url = 'D:/User/Pictures/Red_Dragon.png'
        self.json_url = 'D:/User/Documents/person.json'

    def test_read_image(self):

        # use another method to create image matrix by pillow mudole
        oregin_img = pil.open(self.image_url)
        image_arr = np.asanyarray(oregin_img)

        self.assertEqual(funcs.read_image(
            self.image_url).all(), image_arr.all())

    def test_read_json(self):

        test_dic = {
            "ali": "boxing",
            "bill": "tech",
            "federer": "tennis",
            "ronaldo": "football",
            "woods": "golf"
        }

        self.assertEqual(funcs.read_json(self.json_url), test_dic)
