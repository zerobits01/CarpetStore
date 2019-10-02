# built-in libraries
import sys
import json
import secrets
from pathlib import Path

# third-part libraries
import cv2
import matplotlib.pyplot as plt
import networkx as nx
import numpy as np

# custom libraries
from funcs import color_nodes, quickSort, read_image, strassen
# from strassen import strassen


def change_image_filter(old_image_url, new_image_url):
    """ Implement filter on defiled image """

    img = read_image(old_image_url)
    img = cv2.resize(img, (400, 400))
    filter_matrix = np.random.rand(400, 400, 3)
    new_img = np.zeros((400, 400, 3), np.uint8)

    for x in range(3):
        new_img[:, :, x] = strassen(img[:, :, x], filter_matrix[:, :, x], 400)

    cv2.imwrite(new_image_url, new_img)


def design_new_carpet(graph, file_url):
    """ Give the graph and use graph coloring algorithm to paint it """
    graph_color_dic = color_nodes(graph)
    min_color_count = max(map(lambda x: int(x), graph_color_dic.values()))

    # create a dictionary for organize colors and its nodes
    node_dic = {}
    for counter in range(min_color_count + 1):
        node_dic[counter] = [x for x, y in graph_color_dic.items()
                             if y == str(counter)]

    draw_graph(graph, node_dic, file_url)


def draw_graph(graph, node_dic, file_url):
    """ Draw graph of input graph's json file """

    color_list = ['#99ff66', '#9933ff', '#0066cc', '#996600',
                  '#ff6666', '#009999', '#99ccff', '#ff00ff', '#ff99ff', '#ff9966']

    # create edge array for drawing
    edge_arr = []
    for x in graph.items():
        for y in x[1]:
            edge_arr.append(tuple([x[0], y]))

    # draw graph
    G = nx.Graph()
    G.add_edges_from(edge_arr)
    pos = nx.spring_layout(G)

    # nodes
    for counter in range(len(node_dic)):
        nx.draw_networkx_nodes(G, pos,
                               nodelist=node_dic[counter],
                               node_color=color_list[counter],
                               node_size=2000)

    # edges
    nx.draw_networkx_edges(G, pos, edgelist=edge_arr,
                           width=3, alpha=0.2, edge_color='b', style='dashed')

    # labels
    nx.draw_networkx_labels(G, pos, font_size=20, font_family='sans-serif')

    # remove border
    plt.axis('off')
    # save graph into a png file
    plt.savefig(file_url, format="PNG")


if __name__ == '__main__':
    data = json.loads(sys.argv[1])
    _type = data['type']

    if _type == 'new':
        file_path = data['fpath']
        matrix = data['matrix']
        design_new_carpet(matrix, file_path)

    elif _type == 'filter':
        old_path = data['opath']
        new_path = data['npath']
        change_image_filter(old_path, new_path)
