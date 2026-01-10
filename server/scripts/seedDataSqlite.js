import db from '../config/database.js';

const problems = [
    {
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "easy",
        category: "Arrays",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        constraints: JSON.stringify([
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists"
        ]),
        examples: JSON.stringify([
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]"
            }
        ]),
        starterCode: JSON.stringify({
            javascript: "function twoSum(nums, target) {\n  // Your code here\n}",
            python: "def two_sum(nums, target):\n    # Your code here\n    pass",
            java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}"
        }),
        testCases: JSON.stringify([
            { input: "[2,7,11,15], 9", output: "[0,1]" },
            { input: "[3,2,4], 6", output: "[1,2]" },
            { input: "[3,3], 6", output: "[0,1]" }
        ]),
        tags: JSON.stringify(["Array", "Hash Table"]),
        acceptanceRate: 49.2
    },
    {
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        difficulty: "easy",
        category: "Stack",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
        constraints: JSON.stringify([
            "1 <= s.length <= 10^4",
            "s consists of parentheses only '()[]{}'."
        ]),
        examples: JSON.stringify([
            { input: "s = \"()\"", output: "true" },
            { input: "s = \"()[]{}\"", output: "true" },
            { input: "s = \"(]\"", output: "false" }
        ]),
        starterCode: JSON.stringify({
            javascript: "function isValid(s) {\n  // Your code here\n}",
            python: "def is_valid(s):\n    # Your code here\n    pass",
            java: "class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}"
        }),
        testCases: JSON.stringify([
            { input: "\"()\"", output: "true" },
            { input: "\"()[]{}\"", output: "true" },
            { input: "\"(]\"", output: "false" }
        ]),
        tags: JSON.stringify(["String", "Stack"]),
        acceptanceRate: 40.1
    },
    {
        title: "Merge Two Sorted Lists",
        slug: "merge-two-sorted-lists",
        difficulty: "easy",
        category: "Linked List",
        description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
        constraints: JSON.stringify([
            "The number of nodes in both lists is in the range [0, 50].",
            "-100 <= Node.val <= 100",
            "Both list1 and list2 are sorted in non-decreasing order."
        ]),
        examples: JSON.stringify([
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
        ]),
        starterCode: JSON.stringify({
            javascript: "function mergeTwoLists(list1, list2) {\n  // Your code here\n}",
            python: "def merge_two_lists(list1, list2):\n    # Your code here\n    pass",
            java: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Your code here\n    }\n}"
        }),
        testCases: JSON.stringify([
            { input: "[1,2,4], [1,3,4]", output: "[1,1,2,3,4,4]" }
        ]),
        tags: JSON.stringify(["Linked List", "Recursion"]),
        acceptanceRate: 62.3
    },
    {
        title: "Longest Substring Without Repeating Characters",
        slug: "longest-substring-without-repeating",
        difficulty: "medium",
        category: "Strings",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        constraints: JSON.stringify([
            "0 <= s.length <= 5 * 10^4",
            "s consists of English letters, digits, symbols and spaces."
        ]),
        examples: JSON.stringify([
            {
                input: "s = \"abcabcbb\"",
                output: "3",
                explanation: "The answer is \"abc\", with the length of 3."
            },
            { input: "s = \"bbbbb\"", output: "1" }
        ]),
        starterCode: JSON.stringify({
            javascript: "function lengthOfLongestSubstring(s) {\n  // Your code here\n}",
            python: "def length_of_longest_substring(s):\n    # Your code here\n    pass",
            java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n    }\n}"
        }),
        testCases: JSON.stringify([
            { input: "\"abcabcbb\"", output: "3" },
            { input: "\"bbbbb\"", output: "1" }
        ]),
        tags: JSON.stringify(["Hash Table", "String", "Sliding Window"]),
        acceptanceRate: 33.8
    },
    {
        title: "Container With Most Water",
        slug: "container-with-most-water",
        difficulty: "medium",
        category: "Arrays",
        description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        constraints: JSON.stringify([
            "n == height.length",
            "2 <= n <= 10^5",
            "0 <= height[i] <= 10^4"
        ]),
        examples: JSON.stringify([
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }
        ]),
        starterCode: JSON.stringify({
            javascript: "function maxArea(height) {\n  // Your code here\n}",
            python: "def max_area(height):\n    # Your code here\n    pass",
            java: "class Solution {\n    public int maxArea(int[] height) {\n        // Your code here\n    }\n}"
        }),
        testCases: JSON.stringify([
            { input: "[1,8,6,2,5,4,8,3,7]", output: "49" }
        ]),
        tags: JSON.stringify(["Array", "Two Pointers", "Greedy"]),
        acceptanceRate: 54.2
    },
    {
        title: "Median of Two Sorted Arrays",
        slug: "median-of-two-sorted-arrays",
        difficulty: "hard",
        category: "Binary Search",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
        constraints: JSON.stringify([
            "nums1.length == m",
            "nums2.length == n",
            "0 <= m <= 1000",
            "0 <= n <= 1000",
            "1 <= m + n <= 2000"
        ]),
        examples: JSON.stringify([
            { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" }
        ]),
        starterCode: JSON.stringify({
            javascript: "function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}",
            python: "def find_median_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass",
            java: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Your code here\n    }\n}"
        }),
        testCases: JSON.stringify([
            { input: "[1,3], [2]", output: "2.00000" }
        ]),
        tags: JSON.stringify(["Array", "Binary Search", "Divide and Conquer"]),
        acceptanceRate: 36.7
    }
];

const seedProblems = () => {
    try {
        console.log('Seeding problems...');

        const insert = db.prepare(`
      INSERT OR IGNORE INTO problems 
      (title, slug, difficulty, category, description, constraints, examples, 
       starter_code, test_cases, tags, acceptance_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const insertMany = db.transaction((problems) => {
            for (const problem of problems) {
                insert.run(
                    problem.title,
                    problem.slug,
                    problem.difficulty,
                    problem.category,
                    problem.description,
                    problem.constraints,
                    problem.examples,
                    problem.starterCode,
                    problem.testCases,
                    problem.tags,
                    problem.acceptanceRate
                );
            }
        });

        insertMany(problems);

        console.log(`✓ Seeded ${problems.length} problems`);
    } catch (error) {
        console.error('Error seeding problems:', error);
        throw error;
    }
};

// Run the script
try {
    seedProblems();
    console.log('\n✅ Database seeding complete!');
    process.exit(0);
} catch (error) {
    console.error('\n❌ Database seeding failed:', error);
    process.exit(1);
}
