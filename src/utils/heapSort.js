var array_length;

function heap_root(input, i, attributeToOrderBy) {
    var left = 2 * i + 1;
    var right = 2 * i + 2;
    var max = i;
    
    if (left < array_length && input[left][attributeToOrderBy] > input[max][attributeToOrderBy]) {
        max = left;
    }

    if (right < array_length && input[right][attributeToOrderBy] > input[max][attributeToOrderBy])     {
        max = right;
    }

    if (max != i) {
        swap(input, i, max);
        heap_root(input, max, attributeToOrderBy);
    }
}

function swap(input, index_A, index_B) {
    var temp = input[index_A];

    input[index_A] = input[index_B];
    input[index_B] = temp;
}

export default function heapSort(input, attributeToOrderBy) {
        
    array_length = input.length;

    for (var i = Math.floor(array_length / 2); i >= 0; i -= 1)      {
        heap_root(input, i, attributeToOrderBy);
    }

    for (i = input.length - 1; i > 0; i--) {
        swap(input, 0, i);
        array_length--;
        heap_root(input, 0, attributeToOrderBy);
    }
}