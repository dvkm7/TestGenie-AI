import { CodePreset } from '../types';

export const PRESETS: CodePreset[] = [
  {
    id: 'binary_search',
    title: 'Binary Search (Preloaded)',
    subtitle: 'Classic O(log n) Divide & Conquer Search',
    description: 'Binary search over a sorted ascending array to find target integer.',
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
    right = len(arr) - 2  # BUG: skips the last element!
    
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
        id: 'test_norm_1',
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
        id: 'test_norm_2',
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
        id: 'test_bound_1',
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
        id: 'test_bound_2',
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
        id: 'test_bound_3',
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
        id: 'test_edge_1',
        name: 'test_binary_search_target_outside_range',
        category: 'EDGE',
        description: 'Pathological edge case: Target is strictly smaller than array minimum or strictly larger than array maximum.',
        code: `def test_binary_search_target_outside_range():
    arr = [10, 20, 30, 40]
    # Smaller than minimum
    assert binary_search(arr, 5) == -1
    # Larger than maximum
    assert binary_search(arr, 999) == -1
`,
        inputs_summary: 'arr=[10, 20, 30, 40], targets 5 and 999',
        expected_output: '-1',
        expected_behavior: 'Gracefully returns -1 without out-of-bounds loops',
      },
      {
        id: 'test_edge_2',
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
      {
        id: 'test_edge_3',
        name: 'test_binary_search_duplicate_elements',
        category: 'EDGE',
        description: 'Edge case: Array contains multiple identical values; verifies any valid index of the target is returned without infinite loop.',
        code: `def test_binary_search_duplicate_elements():
    arr = [1, 2, 2, 2, 2, 5, 9]
    result = binary_search(arr, 2)
    assert result in [1, 2, 3, 4]
`,
        inputs_summary: 'arr=[1, 2, 2, 2, 2, 5, 9], target=2',
        expected_output: 'Index in range [1..4]',
        expected_behavior: 'Finds valid occurrence without hanging',
      },
    ],
  },
  {
    id: 'palindrome_checker',
    title: 'Valid Palindrome',
    subtitle: 'Two-pointer String Cleaning & Mirror Check',
    description: 'Check if a string is palindrome after ignoring punctuation and casing.',
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
        description: 'Boundary cases: empty string "" and single character "a".',
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
    title: 'Merge Intervals',
    subtitle: 'Greedy Sorting & Interval Overlaps',
    description: 'Merge overlapping intervals in a list of [start, end] pairs.',
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
      },
      {
        id: 'test_merge_3',
        name: 'test_merge_intervals_touching_and_contained',
        category: 'EDGE',
        description: 'Edge case: Intervals touching exactly at endpoints [1,4] and [4,5], or one interval completely enclosing another.',
        code: `def test_merge_intervals_touching_and_contained():
    assert merge_intervals([[1, 4], [4, 5]]) == [[1, 5]]
    assert merge_intervals([[1, 10], [2, 3], [4, 8]]) == [[1, 10]]
`,
        inputs_summary: '[[1, 4], [4, 5]] and enclosed intervals',
        expected_output: '[[1, 5]] and [[1, 10]]',
      },
    ],
  },
];
