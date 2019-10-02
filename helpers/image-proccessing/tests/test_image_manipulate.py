import unittest
import json
import tempfile

import networkx as nx
import numpy as np

import image_manipulate as img_man
import funcs


class ManipulationTests(unittest.TestCase):

    def setUp(self):

        self.filter = np.random.rand(400, 400, 3)
        self.image_url = 'assets/images/Red_Dragon.png'
        self.image_url2 = 'assets/images/Red_Dragon2.png'
        self.image_url3 = 'assets/images/Red_Dragon3.png'
        self.graph_json_url = 'assets/json files/graph_test.json'
        self.colored_json_url = 'assets/json files/colored_graph.json'

    def test_image_resize(self):
        img = img_man.image_resize(self.image_url, (400, 400))
        img2 = funcs.read_image(self.image_url2)

        self.assertEqual(img.all(), img2.all())

    def test_image_filter(self):
        test_img = funcs.read_image(self.image_url3)
        img = img_man.change_image_filter(self.image_url2, self.filter)

        self.assertEqual(test_img.all(), img.all())

    def test_design_carpet(self):

        colored_dic = funcs.read_json(self.colored_json_url)
        min_color_count = 2

        node_json, min_color = img_man.design_new_carpet(self.graph_json_url)

        self.assertEqual(min_color_count, min_color)
        self.assertEqual(json.loads(node_json), colored_dic)
