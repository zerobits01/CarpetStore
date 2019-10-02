# built-in libraries
import json

# third-part libraries
import cv2
import numpy as np


def partition(arr, low, high):
    i = (low-1)		 # index of smaller element
    pivot = arr[high]	 # pivot

    for j in range(low, high):

        # If current element is smaller than or
        # equal to pivot
        if arr[j] <= pivot:

            # increment index of smaller element
            i = i+1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i+1], arr[high] = arr[high], arr[i+1]
    return (i+1)


# Function to do Quick sort
def quickSort(arr, low, high):
    """ 
    The main function that implements QuickSort.

    arr[] = Array to be sorted, 
    low = Starting index, 
    high = Ending index
    """

    if low < high:

        # pi is partitioning index, arr[p] is now
        # at right place
        pi = partition(arr, low, high)

        # Separately sort elements before
        # partition and after partition
        quickSort(arr, low, pi-1)
        quickSort(arr, pi+1, high)


def color_nodes(graph):
    """ Graph coloring algorithm """

    color_map = {}
    # Consider nodes in descending degree
    for node in sorted(graph, key=lambda x: len(graph[x]), reverse=True):
        neighbor_colors = set(color_map.get(neigh) for neigh in graph[node])
        color_map[node] = next(
            color for color in range(len(graph)) if color not in neighbor_colors
        )

    # sort the dic
    sorted_key_list = sorted(color_map, key=lambda x: color_map[x])
    sorted_dic = {}
    for x in sorted_key_list:
        sorted_dic[x] = str(color_map[x])

    return sorted_dic


def read_json(json_file):
    """ Convert json file to regular dictionary """

    with open(str(json_file)) as file:
        dic = json.load(file)

    return dic


def read_image(url):
    """ Read input image to convert it to array """

    img = cv2.imread(url)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img


def partitionMatrix(matrix):
    length = len(matrix)
    if(length % 2 is not 0):
        stack = []
        for x in range(length + 1):
            stack.append(float(0))
        length += 1
        matrix = np.insert(matrix, len(matrix), values=0, axis=1)
        matrix = np.vstack([matrix, stack])
    d = (length // 2)
    matrix = matrix.reshape(length, length)
    completedPartition = [matrix[:d, :d],
                          matrix[d:, :d], matrix[:d, d:], matrix[d:, d:]]
    return completedPartition


def strassen(mA, mB, length):
    n1 = len(mA)
    n2 = len(mB)

    if (n1 and n2 <= length):
        return (mA * mB)
    else:
        print(mA)
        A = partitionMatrix(mA)
        B = partitionMatrix(mB)
        mc = np.matrix([0 for i in range(len(mA))]for j in range(len(mB)))
        C = partitionMatrix(mc)

        a11 = np.array(A[0])
        a12 = np.array(A[2])
        a21 = np.array(A[1])
        a22 = np.array(A[3])

        b11 = np.array(B[0])
        b12 = np.array(B[2])
        b21 = np.array(B[1])
        b22 = np.array(B[3])

        mone = np.array(strassen((a11 + a22), (b11 + b22), length))
        mtwo = np.array(strassen((a21 + a22), b11, length))
        mthree = np.array(strassen(a11, (b12 - b22), length))
        mfour = np.array(strassen(a22, (b21 - b11), length))
        mfive = np.array(strassen((a11 + a12), b22, length))
        msix = np.array(strassen((a21 - a11), (b11 + b12), length))
        mseven = np.array(strassen((a12 - a22), (b21 + b22), length))

        C[0] = np.array((mone + mfour - mfive + mseven))
        C[2] = np.array((mthree + mfive))
        C[1] = np.array((mtwo + mfour))
        C[3] = np.array((mone - mtwo + mthree + msix))

        return np.array(C)
