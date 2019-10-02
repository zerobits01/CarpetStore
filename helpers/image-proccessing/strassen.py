import numpy as np


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
    """
    Strassen multiplation. It give matrix_1, matrix_2, and the original matrix's length 
    """
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
