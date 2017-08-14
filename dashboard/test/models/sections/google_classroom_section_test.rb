require 'test_helper'

class GoogleClassroomSectionTest < ActiveSupport::TestCase
  test 'from google classroom service' do
    owner = create :teacher
    student_list = Google::Apis::ClassroomV1::ListStudentsResponse.from_json(
      {
        students: [
          {userId: '222222222222222', profile: {name: {fullName: 'Sample User'}}},
          {userId: '333333333333333', profile: {name: {fullName: 'Another Student'}}},
        ],
      }.to_json
    ).students

    section = GoogleClassroomSection.from_service('101', owner.id, student_list, 'Test Section A')
    assert section.provider_managed?
    assert_equal 'G-101', section.code
    assert_equal 'Test Section A', section.name

    assert_no_difference 'User.count' do
      # Should find the existing Google Classroom section.
      section_2 = GoogleClassroomSection.from_service('101', owner.id, student_list, 'Test Section B')
      assert_equal section.id, section_2.id

      # Should update the name to match the imported name.
      assert_equal 'Test Section B', section_2.name
    end
  end
end
