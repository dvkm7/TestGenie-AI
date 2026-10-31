import { CodePreset } from '../types';

export const PRESETS: CodePreset[] = [
  {
    id: 'buggy_binary_search_rca',
    title: '🚨 Buggy Submission (Demo ML RCA)',
    subtitle: 'Simulated Student Boundary Bug with Live Failed Tests',
    description: 'Preloaded buggy student submission with off-by-one boundary failure to demonstrate ML Root Cause Analysis (RCA) and 1-click auto-patch.',
    categoryTag: 'Demo ML RCA & Repair',
    context: `Implement binary search to find a target integer in a sorted ascending array.
Return the 0-based index of the target if present, otherwise return -1.
Note: This submission contains a classic off-by-one boundary bug (right = len(arr) - 2), causing failures when searching for the rightmost array elements.`,
    code: `def binary_search(arr: list[int], target: int) -> int:
    """
    Buggy student submission: off-by-one boundary error!
    Skips the last element when searching ascending arrays.
    """
    left = 0
    right = len(arr) - 2  # BUG: skips the last element of the array!
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1
`,
    buggyCode: `def binary_search(arr: list[int], target: int) -> int:
    """
    Buggy student submission: off-by-one boundary error!
    """
    left = 0
    right = len(arr) - 2
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
`,
    defaultTests: [
      {
        id: 'test_bs_norm_1',
        name: 'test_binary_search_middle_element',
        category: 'NORMAL',
        description: 'Verify standard search where target is located right at the middle index of an odd-length array.',
        code: `def test_binary_search_middle_element():
    arr = [1, 3, 5, 7, 9]
    assert binary_search(arr, 5) == 2
`,
        inputs_summary: 'arr=[1, 3, 5, 7, 9], target=5',
        expected_output: '2',
        expected_behavior: 'Returns exact middle index 2',
      },
      {
        id: 'test_bs_norm_2',
        name: 'test_binary_search_even_length_array',
        category: 'NORMAL',
        description: 'Verify search in an even-length array where division truncates to lower mid.',
        code: `def test_binary_search_even_length_array():
    arr = [10, 20, 30, 40, 50, 60]
    assert binary_search(arr, 20) == 1
    assert binary_search(arr, 50) == 4
`,
        inputs_summary: 'arr=[10, 20, 30, 40, 50, 60], targets 20 and 50',
        expected_output: '1 and 4',
        expected_behavior: 'Correct index found across both halves',
      },
      {
        id: 'test_bs_bound_1',
        name: 'test_binary_search_empty_array',
        category: 'BOUNDARY',
        description: 'Crucial boundary check: Empty input array [] must return -1 immediately without IndexError.',
        code: `def test_binary_search_empty_array():
    assert binary_search([], 10) == -1
    assert binary_search([], 0) == -1
`,
        inputs_summary: 'arr=[], target=10',
        expected_output: '-1',
        expected_behavior: 'Safely returns -1 for empty list',
      },
      {
        id: 'test_bs_bound_2',
        name: 'test_binary_search_single_element_found_and_miss',
        category: 'BOUNDARY',
        description: 'Boundary condition with array length 1: test both match and non-match cases.',
        code: `def test_binary_search_single_element_found_and_miss():
    assert binary_search([42], 42) == 0
    assert binary_search([42], 99) == -1
`,
        inputs_summary: 'arr=[42], target=42 and target=99',
        expected_output: '0 and -1',
        expected_behavior: 'Returns 0 when present, -1 when absent',
      },
      {
        id: 'test_bs_bound_3',
        name: 'test_binary_search_extremities_first_and_last',
        category: 'BOUNDARY',
        description: 'Verify boundary pointers correctly identify index 0 (left-most) and index len-1 (right-most).',
        code: `def test_binary_search_extremities_first_and_last():
    arr = [2, 4, 6, 8, 10, 12]
    assert binary_search(arr, 2) == 0
    assert binary_search(arr, 12) == 5
`,
        inputs_summary: 'arr=[2, 4, 6, 8, 10, 12], targets 2 and 12',
        expected_output: '0 and 5',
        expected_behavior: 'First and last elements detected correctly',
      },
      {
        id: 'test_bs_edge_1',
        name: 'test_binary_search_target_outside_range',
        category: 'EDGE',
        description: 'Pathological edge case: Target is strictly smaller than array minimum or strictly larger than array maximum.',
        code: `def test_binary_search_target_outside_range():
    arr = [10, 20, 30, 40]
    assert binary_search(arr, 5) == -1
    assert binary_search(arr, 999) == -1
`,
        inputs_summary: 'arr=[10, 20, 30, 40], targets 5 and 999',
        expected_output: '-1',
        expected_behavior: 'Gracefully returns -1 without out-of-bounds loops',
      },
      {
        id: 'test_bs_edge_2',
        name: 'test_binary_search_negative_numbers',
        category: 'EDGE',
        description: 'Edge case involving negative integers and crossing zero boundary in sorted order.',
        code: `def test_binary_search_negative_numbers():
    arr = [-50, -20, -5, 0, 15, 30]
    assert binary_search(arr, -20) == 1
    assert binary_search(arr, 0) == 3
    assert binary_search(arr, -100) == -1
`,
        inputs_summary: 'arr=[-50, -20, -5, 0, 15, 30], negative targets',
        expected_output: '1, 3, -1',
        expected_behavior: 'Negative arithmetic preserved correctly',
      },
    ],
  },
  {
    id: 'binary_search',
    title: 'Binary Search (Correct Submission)',
    subtitle: 'Classic O(log n) Divide & Conquer Search',
    description: 'Binary search over a sorted ascending array to find target integer.',
    categoryTag: 'Searching & Divide/Conquer',
    context: `Implement binary search to find a target integer in a sorted ascending array.
Return the 0-based index of the target if present, otherwise return -1.
Requirements & Constraints:
- Array is sorted in non-decreasing order.
- Must handle empty array, single element arrays, first and last element matches.
- Must handle values strictly smaller or larger than all elements in the array.
- Handles duplicate elements gracefully without hanging.`,
    code: `def binary_search(arr: list[int], target: int) -> int:
    """
    Perform binary search on a sorted array to find the target element.
    Returns the 0-based index of the target if found, otherwise -1.
    """
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1
`,
    buggyCode: `def binary_search(arr: list[int], target: int) -> int:
    """
    Buggy version: has off-by-one boundary error in initial right pointer!
    """
    left = 0
    right = len(arr) - 2  # BUG: skips the last element of the array!
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1
`,
    defaultTests: [
      {
        id: 'test_bs_norm_1',
        name: 'test_binary_search_middle_element',
        category: 'NORMAL',
        description: 'Verify standard search where target is located right at the middle index of an odd-length array.',
        code: `def test_binary_search_middle_element():
    arr = [1, 3, 5, 7, 9]
    assert binary_search(arr, 5) == 2
`,
        inputs_summary: 'arr=[1, 3, 5, 7, 9], target=5',
        expected_output: '2',
        expected_behavior: 'Returns exact middle index 2',
      },
      {
        id: 'test_bs_norm_2',
        name: 'test_binary_search_even_length_array',
        category: 'NORMAL',
        description: 'Verify search in an even-length array where division truncates to lower mid.',
        code: `def test_binary_search_even_length_array():
    arr = [10, 20, 30, 40, 50, 60]
    assert binary_search(arr, 20) == 1
    assert binary_search(arr, 50) == 4
`,
        inputs_summary: 'arr=[10, 20, 30, 40, 50, 60], targets 20 and 50',
        expected_output: '1 and 4',
        expected_behavior: 'Correct index found across both halves',
      },
      {
        id: 'test_bs_bound_1',
        name: 'test_binary_search_empty_array',
        category: 'BOUNDARY',
        description: 'Crucial boundary check: Empty input array [] must return -1 immediately without IndexError.',
        code: `def test_binary_search_empty_array():
    assert binary_search([], 10) == -1
    assert binary_search([], 0) == -1
`,
        inputs_summary: 'arr=[], target=10',
        expected_output: '-1',
        expected_behavior: 'Safely returns -1 for empty list',
      },
      {
        id: 'test_bs_bound_2',
        name: 'test_binary_search_single_element_found_and_miss',
        category: 'BOUNDARY',
        description: 'Boundary condition with array length 1: test both match and non-match cases.',
        code: `def test_binary_search_single_element_found_and_miss():
    assert binary_search([42], 42) == 0
    assert binary_search([42], 99) == -1
`,
        inputs_summary: 'arr=[42], target=42 and target=99',
        expected_output: '0 and -1',
        expected_behavior: 'Returns 0 when present, -1 when absent',
      },
      {
        id: 'test_bs_bound_3',
        name: 'test_binary_search_extremities_first_and_last',
        category: 'BOUNDARY',
        description: 'Verify boundary pointers correctly identify index 0 (left-most) and index len-1 (right-most).',
        code: `def test_binary_search_extremities_first_and_last():
    arr = [2, 4, 6, 8, 10, 12]
    assert binary_search(arr, 2) == 0
    assert binary_search(arr, 12) == 5
`,
        inputs_summary: 'arr=[2, 4, 6, 8, 10, 12], targets 2 and 12',
        expected_output: '0 and 5',
        expected_behavior: 'First and last elements detected correctly',
      },
      {
        id: 'test_bs_edge_1',
        name: 'test_binary_search_target_outside_range',
        category: 'EDGE',
        description: 'Pathological edge case: Target is strictly smaller than array minimum or strictly larger than array maximum.',
        code: `def test_binary_search_target_outside_range():
    arr = [10, 20, 30, 40]
    assert binary_search(arr, 5) == -1
    assert binary_search(arr, 999) == -1
`,
        inputs_summary: 'arr=[10, 20, 30, 40], targets 5 and 999',
        expected_output: '-1',
        expected_behavior: 'Gracefully returns -1 without out-of-bounds loops',
      },
      {
        id: 'test_bs_edge_2',
        name: 'test_binary_search_negative_numbers',
        category: 'EDGE',
        description: 'Edge case involving negative integers and crossing zero boundary in sorted order.',
        code: `def test_binary_search_negative_numbers():
    arr = [-50, -20, -5, 0, 15, 30]
    assert binary_search(arr, -20) == 1
    assert binary_search(arr, 0) == 3
    assert binary_search(arr, -100) == -1
`,
        inputs_summary: 'arr=[-50, -20, -5, 0, 15, 30], negative targets',
        expected_output: '1, 3, -1',
        expected_behavior: 'Negative arithmetic preserved correctly',
      },
    ],
  },
  {
    id: 'quicksort',
    title: 'QuickSort (Sorting & Partition)',
    subtitle: 'Recursive Divide-and-Conquer In-Place Sort',
    description: 'Sort an array of comparable numbers into ascending order using pivot partitioning.',
    categoryTag: 'Sorting Algorithms',
    context: `Implement quicksort(arr: list[int]) -> list[int] that sorts an array of integers in non-decreasing order.
Requirements & Constraints:
- Average time complexity: O(n log n).
- Must properly handle empty lists, single element lists, duplicate values, and already sorted arrays.
- Returns a new or modified sorted list.`,
    code: `def quicksort(arr: list[int]) -> list[int]:
    """
    Sort an array of integers in non-decreasing order using QuickSort.
    """
    if len(arr) <= 1:
        return list(arr)
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)
`,
    buggyCode: `def quicksort(arr: list[int]) -> list[int]:
    """
    Buggy version: Omits duplicate middle elements by checking x > pivot instead of partition!
    """
    if len(arr) <= 1:
        return list(arr)
        
    pivot = arr[0]
    # BUG: Elements equal to pivot are accidentally dropped when duplicate!
    left = [x for x in arr[1:] if x < pivot]
    right = [x for x in arr[1:] if x > pivot] # Misses x == pivot!
    
    return quicksort(left) + [pivot] + quicksort(right)
`,
    defaultTests: [
      {
        id: 'test_qs_1',
        name: 'test_quicksort_standard_unsorted',
        category: 'NORMAL',
        description: 'Standard unsorted array of distinct integers.',
        code: `def test_quicksort_standard_unsorted():
    assert quicksort([7, 2, 1, 6, 8, 5, 3, 4]) == [1, 2, 3, 4, 5, 6, 7, 8]
`,
        inputs_summary: '[7, 2, 1, 6, 8, 5, 3, 4]',
        expected_output: '[1, 2, 3, 4, 5, 6, 7, 8]',
        expected_behavior: 'Array sorted in ascending order',
      },
      {
        id: 'test_qs_2',
        name: 'test_quicksort_already_sorted_and_reversed',
        category: 'NORMAL',
        description: 'Already sorted ascending and descending arrays.',
        code: `def test_quicksort_already_sorted_and_reversed():
    assert quicksort([1, 2, 3, 4, 5]) == [1, 2, 3, 4, 5]
    assert quicksort([5, 4, 3, 2, 1]) == [1, 2, 3, 4, 5]
`,
        inputs_summary: '[1, 2, 3, 4, 5] and reverse',
        expected_output: '[1, 2, 3, 4, 5]',
        expected_behavior: 'Handles pre-sorted and reversed sequences',
      },
      {
        id: 'test_qs_3',
        name: 'test_quicksort_empty_and_single_element',
        category: 'BOUNDARY',
        description: 'Boundary base cases: empty array and 1-element array.',
        code: `def test_quicksort_empty_and_single_element():
    assert quicksort([]) == []
    assert quicksort([99]) == [99]
`,
        inputs_summary: '[] and [99]',
        expected_output: '[] and [99]',
        expected_behavior: 'Immediately returns base cases without recursion depth error',
      },
      {
        id: 'test_qs_4',
        name: 'test_quicksort_duplicate_elements',
        category: 'EDGE',
        description: 'Edge case: Array containing heavy duplicate elements and all-identical values.',
        code: `def test_quicksort_duplicate_elements():
    assert quicksort([4, 2, 4, 3, 2, 4, 1]) == [1, 2, 2, 3, 4, 4, 4]
    assert quicksort([5, 5, 5, 5]) == [5, 5, 5, 5]
`,
        inputs_summary: '[4, 2, 4, 3, 2, 4, 1] and [5, 5, 5, 5]',
        expected_output: '[1, 2, 2, 3, 4, 4, 4]',
        expected_behavior: 'Duplicate values preserved without omission',
      },
      {
        id: 'test_qs_5',
        name: 'test_quicksort_negative_and_zero',
        category: 'EDGE',
        description: 'Edge case: Array containing negative numbers and zeroes.',
        code: `def test_quicksort_negative_and_zero():
    assert quicksort([0, -10, 5, -2, 3, -10]) == [-10, -10, -2, 0, 3, 5]
`,
        inputs_summary: '[0, -10, 5, -2, 3, -10]',
        expected_output: '[-10, -10, -2, 0, 3, 5]',
        expected_behavior: 'Correct sign ordering across zero',
      },
    ],
  },
  {
    id: 'two_sum',
    title: 'Two Sum (Hash Map Lookup)',
    subtitle: 'Optimal O(n) Pair Search',
    description: 'Find indices of two numbers in an array that add up to a target sum.',
    categoryTag: 'Arrays & Hashing',
    context: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
Requirements & Constraints:
- Exactly one valid solution exists.
- You may not use the same element twice (e.g. index i != index j).
- Return indices in any valid pair order [i, j].
- Expected time complexity: O(n) using a hash map lookup.`,
    code: `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Find indices of two numbers that add up to target using a hash map.
    """
    seen = {}
    for idx, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], idx]
        seen[num] = idx
    return []
`,
    buggyCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Buggy version: Inserts number before checking, so it can match itself!
    """
    seen = {}
    for idx, num in enumerate(nums):
        seen[num] = idx  # BUG: Inserts early!
        complement = target - num
        if complement in seen:
            return [seen[complement], idx]  # BUG: Returns [idx, idx] if num*2 == target!
    return []
`,
    defaultTests: [
      {
        id: 'test_ts_1',
        name: 'test_two_sum_standard_case',
        category: 'NORMAL',
        description: 'Standard positive array with pair in middle.',
        code: `def test_two_sum_standard_case():
    result = two_sum([2, 7, 11, 15], 9)
    assert sorted(result) == [0, 1]
`,
        inputs_summary: 'nums=[2, 7, 11, 15], target=9',
        expected_output: '[0, 1]',
        expected_behavior: '2 + 7 = 9 at indices 0 and 1',
      },
      {
        id: 'test_ts_2',
        name: 'test_two_sum_pair_at_extremities',
        category: 'BOUNDARY',
        description: 'Pair numbers located at index 0 and index len-1.',
        code: `def test_two_sum_pair_at_extremities():
    result = two_sum([10, 20, 30, 40, 50], 60)
    assert sorted(result) in [[0, 4], [1, 3]]
`,
        inputs_summary: 'nums=[10, 20, 30, 40, 50], target=60',
        expected_output: '[0, 4] or [1, 3]',
        expected_behavior: 'Boundary elements sum to 60',
      },
      {
        id: 'test_ts_3',
        name: 'test_two_sum_same_element_cannot_be_reused',
        category: 'EDGE',
        description: 'Edge case: target is double of an element; cannot return same index twice.',
        code: `def test_two_sum_same_element_cannot_be_reused():
    result = two_sum([3, 2, 4], 6)
    assert sorted(result) == [1, 2]
    # Ensure it did NOT reuse index 0 (3 + 3 = 6)
    assert result != [0, 0]
`,
        inputs_summary: 'nums=[3, 2, 4], target=6',
        expected_output: '[1, 2]',
        expected_behavior: 'Cannot reuse element at index 0',
      },
      {
        id: 'test_ts_4',
        name: 'test_two_sum_with_negative_numbers',
        category: 'EDGE',
        description: 'Edge case with negative values and sum across zero.',
        code: `def test_two_sum_with_negative_numbers():
    result = two_sum([-3, 4, 3, 90], 0)
    assert sorted(result) == [0, 2]
`,
        inputs_summary: 'nums=[-3, 4, 3, 90], target=0',
        expected_output: '[0, 2]',
        expected_behavior: '-3 + 3 = 0',
      },
    ],
  },
  {
    id: 'valid_parentheses',
    title: 'Valid Parentheses (Stack Parser)',
    subtitle: 'O(n) Bracket Balancing & Syntax Validation',
    description: 'Validate whether brackets (), {}, [] in a string are closed in the correct order.',
    categoryTag: 'Stacks & Parsers',
    context: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.
Expected time complexity: O(n) using a Stack data structure.`,
    code: `def is_valid_parentheses(s: str) -> bool:
    """
    Validate if bracket sequence is balanced using a stack.
    """
    mapping = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
            
    return len(stack) == 0
`,
    buggyCode: `def is_valid_parentheses(s: str) -> bool:
    """
    Buggy version: fails with IndexError when closing bracket appears with empty stack!
    """
    mapping = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in mapping:
            # BUG: Unsafe pop() without checking if stack has elements!
            top_element = stack.pop()
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
            
    return len(stack) == 0
`,
    defaultTests: [
      {
        id: 'test_vp_1',
        name: 'test_valid_simple_and_nested',
        category: 'NORMAL',
        description: 'Standard nested and sequential brackets.',
        code: `def test_valid_simple_and_nested():
    assert is_valid_parentheses("()") == True
    assert is_valid_parentheses("()[]{}") == True
    assert is_valid_parentheses("{[()]}") == True
`,
        inputs_summary: '"()", "()[]{}", "{[()]}"',
        expected_output: 'True',
        expected_behavior: 'Properly nested brackets return True',
      },
      {
        id: 'test_vp_2',
        name: 'test_empty_string_boundary',
        category: 'BOUNDARY',
        description: 'Empty string boundary check: should be trivially valid.',
        code: `def test_empty_string_boundary():
    assert is_valid_parentheses("") == True
`,
        inputs_summary: '""',
        expected_output: 'True',
        expected_behavior: 'Empty string is valid',
      },
      {
        id: 'test_vp_3',
        name: 'test_starting_with_closing_bracket',
        category: 'EDGE',
        description: 'Edge case: String starts immediately with a closing bracket; must not throw IndexError.',
        code: `def test_starting_with_closing_bracket():
    assert is_valid_parentheses(")") == False
    assert is_valid_parentheses("]}") == False
`,
        inputs_summary: '")" and "]}"',
        expected_output: 'False',
        expected_behavior: 'Safely returns False without IndexError crash',
      },
      {
        id: 'test_vp_4',
        name: 'test_unclosed_opening_brackets',
        category: 'EDGE',
        description: 'Edge case: All opening brackets with no closing brackets.',
        code: `def test_unclosed_opening_brackets():
    assert is_valid_parentheses("(((") == False
    assert is_valid_parentheses("{[(") == False
`,
        inputs_summary: '"(((" and "{[("',
        expected_output: 'False',
        expected_behavior: 'Returns False because stack is not empty at end',
      },
    ],
  },
  {
    id: 'bfs_shortest_path',
    title: 'BFS Shortest Path (Graph Traversal)',
    subtitle: 'O(V + E) 2D Grid Shortest Path Search',
    description: 'Find shortest path distance from start (0,0) to target (R-1, C-1) avoiding obstacles.',
    categoryTag: 'Graphs & BFS',
    context: `Given an R x C binary grid where 0 represents an open path and 1 represents an obstacle,
return the minimum number of steps to travel from top-left (0, 0) to bottom-right (R-1, C-1).
Movements allowed: 4 directions (up, down, left, right).
If no path exists, return -1.
Expected time complexity: O(R * C) via Breadth-First Search (Queue).`,
    code: `def shortest_path_grid(grid: list[list[int]]) -> int:
    """
    Find shortest path distance from (0,0) to (R-1, C-1) in a grid using BFS.
    """
    if not grid or not grid[0]:
        return -1
    rows, cols = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[rows - 1][cols - 1] == 1:
        return -1
    if rows == 1 and cols == 1:
        return 0
        
    queue = [(0, 0, 0)]  # (r, c, distance)
    visited = {(0, 0)}
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while queue:
        r, c, dist = queue.pop(0)
        if r == rows - 1 and c == cols - 1:
            return dist
            
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                if (nr, nc) not in visited:
                    visited.add((nr, nc))
                    queue.append((nr, nc, dist + 1))
                    
    return -1
`,
    buggyCode: `def shortest_path_grid(grid: list[list[int]]) -> int:
    """
    Buggy version: does not check if start cell (0,0) is blocked!
    """
    if not grid or not grid[0]:
        return -1
    rows, cols = len(grid), len(grid[0])
    # BUG: Forgot to check if grid[0][0] == 1!
    queue = [(0, 0, 0)]
    visited = {(0, 0)}
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while queue:
        r, c, dist = queue.pop(0)
        if r == rows - 1 and c == cols - 1:
            return dist
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                if (nr, nc) not in visited:
                    visited.add((nr, nc))
                    queue.append((nr, nc, dist + 1))
    return -1
`,
    defaultTests: [
      {
        id: 'test_bfs_1',
        name: 'test_bfs_clear_path',
        category: 'NORMAL',
        description: 'Standard 3x3 grid with clear open path.',
        code: `def test_bfs_clear_path():
    grid = [
        [0, 0, 0],
        [1, 1, 0],
        [0, 0, 0]
    ]
    assert shortest_path_grid(grid) == 4
`,
        inputs_summary: '3x3 grid with obstacle in middle row',
        expected_output: '4',
        expected_behavior: 'Circumvents obstacle in 4 steps',
      },
      {
        id: 'test_bfs_2',
        name: 'test_bfs_single_cell_grid',
        category: 'BOUNDARY',
        description: 'Boundary case: 1x1 grid already at target.',
        code: `def test_bfs_single_cell_grid():
    assert shortest_path_grid([[0]]) == 0
`,
        inputs_summary: '[[0]]',
        expected_output: '0',
        expected_behavior: '0 steps needed for 1x1 grid',
      },
      {
        id: 'test_bfs_3',
        name: 'test_bfs_blocked_start_and_destination',
        category: 'EDGE',
        description: 'Edge case: Start cell (0,0) or destination is an obstacle.',
        code: `def test_bfs_blocked_start_and_destination():
    assert shortest_path_grid([[1, 0], [0, 0]]) == -1
    assert shortest_path_grid([[0, 0], [0, 1]]) == -1
`,
        inputs_summary: 'Blocked start [1,0] and destination [0,1]',
        expected_output: '-1',
        expected_behavior: 'Returns -1 when start or end is blocked',
      },
      {
        id: 'test_bfs_4',
        name: 'test_bfs_no_possible_path',
        category: 'EDGE',
        description: 'Edge case: Full wall of obstacles cutting off destination.',
        code: `def test_bfs_no_possible_path():
    grid = [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
    assert shortest_path_grid(grid) == -1
`,
        inputs_summary: 'Solid vertical wall of 1s',
        expected_output: '-1',
        expected_behavior: 'Returns -1 when target is unreachable',
      },
    ],
  },
  {
    id: 'lcs_dp',
    title: 'Longest Common Subsequence (LCS DP)',
    subtitle: 'O(m*n) Dynamic Programming Matrix',
    description: 'Find length of the longest subsequence present in both strings in the same relative order.',
    categoryTag: 'Dynamic Programming',
    context: `Given two strings text1 and text2, return the length of their longest common subsequence.
If there is no common subsequence, return 0.
A subsequence of a string is a new string generated from the original string with some characters (can be none)
deleted without changing the relative order of the remaining characters.
Expected time complexity: O(m * n) with DP table.`,
    code: `def longest_common_subsequence(text1: str, text2: str) -> int:
    """
    Find length of the longest common subsequence using dynamic programming.
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    return dp[m][n]
`,
    buggyCode: `def longest_common_subsequence(text1: str, text2: str) -> int:
    """
    Buggy version: compares text1[i] instead of text1[i-1], causing off-by-one IndexError!
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # BUG: Off-by-one indexing error triggers IndexError on final iteration!
            if text1[i] == text2[j]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    return dp[m][n]
`,
    defaultTests: [
      {
        id: 'test_lcs_1',
        name: 'test_lcs_typical_strings',
        category: 'NORMAL',
        description: 'Standard textbook strings: "abcde" and "ace" -> "ace" (len 3).',
        code: `def test_lcs_typical_strings():
    assert longest_common_subsequence("abcde", "ace") == 3
    assert longest_common_subsequence("abc", "abc") == 3
`,
        inputs_summary: '"abcde" and "ace"',
        expected_output: '3',
        expected_behavior: 'Finds subsequence length 3',
      },
      {
        id: 'test_lcs_2',
        name: 'test_lcs_empty_string_boundary',
        category: 'BOUNDARY',
        description: 'Boundary condition: one or both strings are empty.',
        code: `def test_lcs_empty_string_boundary():
    assert longest_common_subsequence("", "xyz") == 0
    assert longest_common_subsequence("hello", "") == 0
    assert longest_common_subsequence("", "") == 0
`,
        inputs_summary: '"" and non-empty strings',
        expected_output: '0',
        expected_behavior: 'Returns 0 for empty strings without error',
      },
      {
        id: 'test_lcs_3',
        name: 'test_lcs_disjoint_characters',
        category: 'EDGE',
        description: 'Edge case: Strings share zero characters.',
        code: `def test_lcs_disjoint_characters():
    assert longest_common_subsequence("abc", "def") == 0
`,
        inputs_summary: '"abc" and "def"',
        expected_output: '0',
        expected_behavior: 'Returns 0 when no characters match',
      },
    ],
  },
  {
    id: 'palindrome_checker',
    title: 'Valid Palindrome (Two-Pointer)',
    subtitle: 'String Sanitization & Mirror Symmetry',
    description: 'Check if a string is palindrome after ignoring punctuation and casing.',
    categoryTag: 'Strings & Pointers',
    context: `Write a function is_palindrome(s: str) -> bool that checks if a string is a palindrome.
Requirements:
- Consider alphanumeric characters only.
- Case-insensitive comparison.
- Handle empty strings and strings with only spaces/punctuation as True.`,
    code: `def is_palindrome(s: str) -> bool:
    """
    Check if a string is a palindrome, ignoring non-alphanumeric characters and case.
    """
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]
`,
    buggyCode: `def is_palindrome(s: str) -> bool:
    """
    Buggy version: does not lower-case characters, failing case-insensitive tests!
    """
    # BUG: Missing c.lower()!
    cleaned = [c for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]
`,
    defaultTests: [
      {
        id: 'test_pal_1',
        name: 'test_palindrome_standard_sentence',
        category: 'NORMAL',
        description: 'Standard phrase with mixed cases and punctuation.',
        code: `def test_palindrome_standard_sentence():
    assert is_palindrome("A man, a plan, a canal: Panama") == True
    assert is_palindrome("race a car") == False
`,
        inputs_summary: '"A man, a plan, a canal: Panama"',
        expected_output: 'True',
        expected_behavior: 'Cleaned sentence matches in reverse',
      },
      {
        id: 'test_pal_2',
        name: 'test_palindrome_empty_and_single_char',
        category: 'BOUNDARY',
        description: 'Boundary cases: empty string "" and single character "x".',
        code: `def test_palindrome_empty_and_single_char():
    assert is_palindrome("") == True
    assert is_palindrome("x") == True
`,
        inputs_summary: '"" and "x"',
        expected_output: 'True',
        expected_behavior: 'Trivially palindrome',
      },
      {
        id: 'test_pal_3',
        name: 'test_palindrome_only_symbols_and_numbers',
        category: 'EDGE',
        description: 'Edge case: String composed entirely of symbols, whitespace, or digits.',
        code: `def test_palindrome_only_symbols_and_numbers():
    assert is_palindrome(".,!?   :::") == True
    assert is_palindrome("12321") == True
    assert is_palindrome("12345") == False
`,
        inputs_summary: 'symbols only and numeric strings',
        expected_output: 'True, True, False',
        expected_behavior: 'Numeric and symbol strings handled correctly',
      },
    ],
  },
  {
    id: 'merge_intervals',
    title: 'Merge Intervals (Greedy)',
    subtitle: 'Sorting & Overlapping Range Fusion',
    description: 'Merge overlapping intervals in a list of [start, end] pairs.',
    categoryTag: 'Greedy & Intervals',
    context: `Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals.
Return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    code: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    """
    Merge overlapping intervals.
    """
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        prev_start, prev_end = merged[-1]
        if current[0] <= prev_end:
            merged[-1] = [prev_start, max(prev_end, current[1])]
        else:
            merged.append(current)
            
    return merged
`,
    buggyCode: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    """
    Buggy version: fails when intervals touch at endpoints (uses < instead of <=)!
    """
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        prev_start, prev_end = merged[-1]
        # BUG: Uses strictly less than (<) instead of (<=), failing touching intervals!
        if current[0] < prev_end:
            merged[-1] = [prev_start, max(prev_end, current[1])]
        else:
            merged.append(current)
    return merged
`,
    defaultTests: [
      {
        id: 'test_merge_1',
        name: 'test_merge_intervals_overlapping_chain',
        category: 'NORMAL',
        description: 'Typical chain of overlapping intervals.',
        code: `def test_merge_intervals_overlapping_chain():
    input_intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
    assert merge_intervals(input_intervals) == [[1, 6], [8, 10], [15, 18]]
`,
        inputs_summary: '[[1, 3], [2, 6], [8, 10], [15, 18]]',
        expected_output: '[[1, 6], [8, 10], [15, 18]]',
        expected_behavior: 'Overlapping intervals merged properly',
      },
      {
        id: 'test_merge_2',
        name: 'test_merge_intervals_empty_and_single',
        category: 'BOUNDARY',
        description: 'Boundary input: empty list and single interval.',
        code: `def test_merge_intervals_empty_and_single():
    assert merge_intervals([]) == []
    assert merge_intervals([[1, 4]]) == [[1, 4]]
`,
        inputs_summary: '[] and [[1, 4]]',
        expected_output: '[] and [[1, 4]]',
        expected_behavior: 'Base cases handled correctly',
      },
      {
        id: 'test_merge_3',
        name: 'test_merge_intervals_touching_and_contained',
        category: 'EDGE',
        description: 'Edge case: Intervals touching exactly at endpoints [1,4] and [4,5], or fully enclosed.',
        code: `def test_merge_intervals_touching_and_contained():
    assert merge_intervals([[1, 4], [4, 5]]) == [[1, 5]]
    assert merge_intervals([[1, 10], [2, 3], [4, 8]]) == [[1, 10]]
`,
        inputs_summary: '[[1, 4], [4, 5]] and enclosed intervals',
        expected_output: '[[1, 5]] and [[1, 10]]',
        expected_behavior: 'Touching and enclosed intervals handled seamlessly',
      },
    ],
  },
  {
    id: 'custom_code',
    title: 'Custom Python Code (User-Defined)',
    subtitle: 'Arbitrary Algorithm & Student Scratchpad',
    description: 'Write, edit, and test any custom Python code with automated AI unit tests and ML feedback.',
    categoryTag: 'Custom User Code',
    context: `Write your custom algorithm or assignment solution here!
You can specify custom problem requirements, time complexity, input constraints,
and click "Generate AI Unit Tests" to generate NORMAL, BOUNDARY, and EDGE test suites automatically.`,
    code: `def custom_algorithm(numbers: list[int]) -> int:
    """
    Custom student algorithm template.
    You can replace this with ANY custom Python function, class, or script!
    """
    if not numbers:
        return 0
    return sum(numbers)
`,
    buggyCode: `def custom_algorithm(numbers: list[int]) -> int:
    """
    Buggy version: raises ZeroDivisionError on empty input!
    """
    return sum(numbers) // len(numbers)
`,
    defaultTests: [
      {
        id: 'test_custom_norm',
        name: 'test_custom_algorithm_standard',
        category: 'NORMAL',
        description: 'Standard happy-path test for custom algorithm with positive numbers.',
        code: `def test_custom_algorithm_standard():
    assert custom_algorithm([1, 2, 3, 4, 5]) == 15
`,
        inputs_summary: 'numbers=[1, 2, 3, 4, 5]',
        expected_output: '15',
        expected_behavior: 'Returns sum of elements',
      },
      {
        id: 'test_custom_bound',
        name: 'test_custom_algorithm_empty_list',
        category: 'BOUNDARY',
        description: 'Boundary test: verify custom algorithm handles empty list [] cleanly.',
        code: `def test_custom_algorithm_empty_list():
    assert custom_algorithm([]) == 0
`,
        inputs_summary: 'numbers=[]',
        expected_output: '0',
        expected_behavior: 'Returns 0 without exception',
      },
      {
        id: 'test_custom_edge',
        name: 'test_custom_algorithm_negative_and_single',
        category: 'EDGE',
        description: 'Edge test: single item and negative numbers.',
        code: `def test_custom_algorithm_negative_and_single():
    assert custom_algorithm([42]) == 42
    assert custom_algorithm([-10, 10]) == 0
`,
        inputs_summary: 'numbers=[42] and [-10, 10]',
        expected_output: '42 and 0',
        expected_behavior: 'Handles single element and cancellations',
      },
    ],
  },
];
