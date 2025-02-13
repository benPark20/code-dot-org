require 'test_helper'

class OmniAuthSectionTest < ActiveSupport::TestCase
  test 'from omniauth' do
    owner = create :teacher
    students = [
      OmniAuth::AuthHash.new(
        uid: 111,
        provider: 'google_oauth2',
        info: {
          name: 'Sample User',
        },
      )
    ]

    section = OmniAuthSection.from_omniauth(
      code: 'G-222222',
      type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
      owner_id: owner.id,
      students: students,
    )
    section.reload
    assert_equal 'G-222222', section.code
    assert_equal User.from_omniauth(students.first, {}), section.students.first

    assert_no_difference 'User.count' do
      # Should find the existing Google Classroom section.
      section_2 = OmniAuthSection.from_omniauth(
        code: 'G-222222',
        type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
        owner_id: owner.id,
        students: students,
      )
      assert_equal section.id, section_2.id
    end

    students << OmniAuth::AuthHash.new(
      uid: 333,
      provider: 'google_oauth2',
      info: {
        name: 'Added Student',
      },
    )
    assert_difference 'User.count', 1 do
      # Should add 1 student to the existing Google Classroom section.
      section_3 = OmniAuthSection.from_omniauth(
        code: 'G-222222',
        type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
        owner_id: owner.id,
        students: students,
      )
      assert_equal section.id, section_3.id
    end
  end

  test 'from omniauth takeover by different owner after account deletion' do
    # This tests the scenario where a teacher imports a section, then deletes their account,
    # then recreates a new account and tries to reimport the same section (now with a different
    # user_id)
    owner = create :teacher
    new_owner = create :teacher
    students = [
      OmniAuth::AuthHash.new(
        uid: 111,
        provider: 'google_oauth2',
        info: {
          name: 'Sample User',
        },
      )
    ]

    section = OmniAuthSection.from_omniauth(
      code: 'G-222222',
      type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
      owner_id: owner.id,
      students: students,
    )
    section.reload
    assert_equal 'G-222222', section.code
    assert_equal owner.id, section.user_id

    owner.destroy

    new_section = OmniAuthSection.from_omniauth(
      code: 'G-222222',
      type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
      owner_id: new_owner.id,
      students: students,
    )
    new_section.reload
    assert_equal section.id, new_section.id
    assert_equal 'G-222222', new_section.code
    assert_equal new_owner.id, new_section.user_id
  end

  test 'import section twice' do
    # This happens when a google classroom/clever section with multiple teachers is imported twice.
    owner = create :teacher
    coteacher = create :teacher
    students = [
      OmniAuth::AuthHash.new(
        uid: 111,
        provider: 'google_oauth2',
        info: {
          name: 'Sample User',
        },
        )
    ]

    section = OmniAuthSection.from_omniauth(
      code: 'G-222222',
      type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
      owner_id: owner.id,
      students: students,
      )
    section.reload
    assert_equal 'G-222222', section.code
    assert_equal owner.id, section.user_id

    new_section = OmniAuthSection.from_omniauth(
      code: 'G-222222',
      type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
      owner_id: coteacher.id,
      students: students,
      )
    new_section.reload
    assert_equal section.id, new_section.id
    assert_equal 'G-222222', new_section.code

    # Section owner doesn't change
    assert_equal owner.id, new_section.user_id
    # Coteacher is added
    assert_equal [owner.id, coteacher.id].sort, new_section.instructors.pluck(:id).sort
  end

  test 're-establish soft deleted coteacher' do
    # This happens when a google classroom/clever section with multiple teachers is imported twice.
    owner = create :teacher
    coteacher = create :teacher
    students = [
      OmniAuth::AuthHash.new(
        uid: 111,
        provider: 'google_oauth2',
        info: {
          name: 'Sample User',
        },
        )
    ]

    section = OmniAuthSection.from_omniauth(
      code: 'G-222222',
      type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
      owner_id: owner.id,
      students: students,
      )
    section.reload
    assert_equal 'G-222222', section.code
    assert_equal owner.id, section.user_id

    section_before_delete = OmniAuthSection.from_omniauth(
      code: 'G-222222',
      type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
      owner_id: coteacher.id,
      students: students,
      )
    section_before_delete.reload

    coteacher_instructor = section_before_delete.section_instructors.where(instructor: coteacher).first

    coteacher_instructor.destroy

    new_section = OmniAuthSection.from_omniauth(
      code: 'G-222222',
      type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
      owner_id: coteacher.id,
      students: students,
      )
    new_section.reload
    assert_equal section.id, new_section.id
    assert_equal 'G-222222', new_section.code

    # Section owner doesn't change
    assert_equal owner.id, new_section.user_id
    # Coteacher is restored
    assert_equal 'active', new_section.section_instructors.where(id: coteacher_instructor.id).first.status
    assert_equal [owner.id, coteacher.id].sort, new_section.instructors.pluck(:id).sort
  end

  test 'set exact student list' do
    teacher = create :teacher
    section = create :section, user: teacher, login_type: 'clever'

    students = (0...5).map do
      create :student
    end

    section.set_exact_student_list(students)
    assert_equal students.pluck(:id).sort, section.reload.students.pluck(:id).sort

    added_students = (0...5).map do
      create :student
    end
    updated_students = students[1...3] + added_students

    section.set_exact_student_list(updated_students)
    assert_equal updated_students.pluck(:id).sort, section.reload.students.pluck(:id).sort
  end

  test 'truncate section name when too long' do
    owner = create :teacher
    course_name = 'test' * 65

    section = OmniAuthSection.from_omniauth(
      code: 'G-222222',
      type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM,
      owner_id: owner.id,
      students: [],
      section_name: course_name
    )
    section.reload
    assert_equal OmniAuthSection.column_for_attribute(:name).limit, section.name.length
    assert section.name.end_with?('...')
  end

  test 'unarchive archived sections when imported' do
    owner = create :teacher

    section = create :section, user: owner, login_type: Section::LOGIN_TYPE_GOOGLE_CLASSROOM, hidden: true

    OmniAuthSection.from_omniauth(
      code: section.code,
      type: section.login_type,
      owner_id: owner.id,
      students: [],
        )
    refute section.reload.hidden
  end
end
