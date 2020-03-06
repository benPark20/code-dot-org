import {assert, expect} from '../../../util/reconfiguredChai';
import sectionStandardsProgress, {
  setTeacherCommentForReport,
  getUnpluggedLessonsForScript,
  getNumberLessonsInScript,
  lessonsByStandard,
  getNumberLessonsCompleted,
  getPluggedLessonCompletionStatus,
  getUnpluggedLessonCompletionStatus
} from '@cdo/apps/templates/sectionProgress/standards/sectionStandardsProgressRedux';
import {
  stageId,
  scriptId,
  stage,
  stateForTeacherMarkedAndProgress,
  stateForTeacherMarkedIncompletedLesson,
  stateForTeacherMarkedCompletedLesson,
  stateForCompletedLesson,
  stateForPartiallyCompletedLesson,
  fakeState
} from '@cdo/apps/templates/sectionProgress/standards/standardsTestHelpers';

describe('sectionStandardsProgressRedux', () => {
  const initialState = sectionStandardsProgress(undefined, {});

  describe('setTeacherCommentForReport', () => {
    it('can set the teacher comment', () => {
      const action = setTeacherCommentForReport(
        'A lovely comment about my class'
      );
      const nextState = sectionStandardsProgress(initialState, action);
      assert.deepEqual(
        nextState.teacherComment,
        'A lovely comment about my class'
      );
    });
  });

  describe('getNumberLessonsInScript', () => {
    it('gets the correct number of lessons in the script', () => {
      assert.deepEqual(getNumberLessonsInScript(fakeState), 3);
    });
  });

  describe('lessonsByStandard', () => {
    it('gets the correct lessons and completion by standard, no progress, no scores', () => {
      assert.deepEqual(lessonsByStandard(fakeState), {
        4: [
          {
            completed: false,
            lessonNumber: 2,
            name: 'Learn to Drag and Drop',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: false,
            url: 'https://curriculum.code.org/csf-19/coursea/2'
          },
          {
            completed: false,
            lessonNumber: 3,
            name: 'Happy Maps',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: true,
            url: 'https://curriculum.code.org/csf-19/coursea/3'
          }
        ],
        16: [
          {
            completed: false,
            lessonNumber: 1,
            name: 'Going Places Safely',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: true,
            url: 'https://curriculum.code.org/csf-19/coursea/1'
          },
          {
            completed: false,
            lessonNumber: 2,
            name: 'Learn to Drag and Drop',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: false,
            url: 'https://curriculum.code.org/csf-19/coursea/2'
          }
        ],
        17: [
          {
            completed: false,
            lessonNumber: 1,
            name: 'Going Places Safely',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: true,
            url: 'https://curriculum.code.org/csf-19/coursea/1'
          },
          {
            completed: false,
            lessonNumber: 2,
            name: 'Learn to Drag and Drop',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: false,
            url: 'https://curriculum.code.org/csf-19/coursea/2'
          }
        ]
      });
    });

    // Plugged lessons calculate completion based on progress.
    // Unplugged lessons calculate completion based on teacher score.
    it('gets the correct lessons and completion by standard, completed lesson based only on progress', () => {
      assert.deepEqual(lessonsByStandard(stateForCompletedLesson), {
        4: [
          {
            completed: false,
            lessonNumber: 2,
            name: 'Learn to Drag and Drop',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: false,
            url: 'https://curriculum.code.org/csf-19/coursea/2'
          },
          {
            completed: false,
            lessonNumber: 3,
            name: 'Happy Maps',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: true,
            url: 'https://curriculum.code.org/csf-19/coursea/3'
          }
        ],
        16: [
          {
            completed: false,
            lessonNumber: 1,
            name: 'Going Places Safely',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: true,
            url: 'https://curriculum.code.org/csf-19/coursea/1'
          },
          {
            completed: false,
            lessonNumber: 2,
            name: 'Learn to Drag and Drop',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: false,
            url: 'https://curriculum.code.org/csf-19/coursea/2'
          }
        ],
        17: [
          {
            completed: false,
            lessonNumber: 1,
            name: 'Going Places Safely',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: true,
            url: 'https://curriculum.code.org/csf-19/coursea/1'
          },
          {
            completed: false,
            lessonNumber: 2,
            name: 'Learn to Drag and Drop',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: false,
            url: 'https://curriculum.code.org/csf-19/coursea/2'
          }
        ]
      });
    });

    it('gets the correct lessons and completion by standard, plugged lesson completion based on progress, unplugged based on teacher score', () => {
      assert.deepEqual(lessonsByStandard(stateForTeacherMarkedAndProgress), {
        4: [
          {
            completed: false,
            lessonNumber: 2,
            name: 'Learn to Drag and Drop',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: false,
            url: 'https://curriculum.code.org/csf-19/coursea/2'
          },
          {
            completed: false,
            lessonNumber: 3,
            name: 'Happy Maps',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: true,
            url: 'https://curriculum.code.org/csf-19/coursea/3'
          }
        ],
        16: [
          {
            completed: true,
            lessonNumber: 1,
            name: 'Going Places Safely',
            numStudents: 4,
            numStudentsCompleted: 1,
            unplugged: true,
            url: 'https://curriculum.code.org/csf-19/coursea/1'
          },
          {
            completed: false,
            lessonNumber: 2,
            name: 'Learn to Drag and Drop',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: false,
            url: 'https://curriculum.code.org/csf-19/coursea/2'
          }
        ],
        17: [
          {
            completed: true,
            lessonNumber: 1,
            name: 'Going Places Safely',
            numStudents: 4,
            numStudentsCompleted: 1,
            unplugged: true,
            url: 'https://curriculum.code.org/csf-19/coursea/1'
          },
          {
            completed: false,
            lessonNumber: 2,
            name: 'Learn to Drag and Drop',
            numStudents: 4,
            numStudentsCompleted: 0,
            unplugged: false,
            url: 'https://curriculum.code.org/csf-19/coursea/2'
          }
        ]
      });
    });
  });

  describe('getUnpluggedLessonsForScript', () => {
    it('gets the unplugged lessons for script', () => {
      assert.deepEqual(getUnpluggedLessonsForScript(fakeState), [
        {
          id: 662,
          name: 'Going Places Safely',
          number: 1,
          url: 'https://curriculum.code.org/csf-19/coursea/1'
        },
        {
          id: 664,
          name: 'Happy Maps',
          number: 3,
          url: 'https://curriculum.code.org/csf-19/coursea/3'
        }
      ]);
    });
  });

  describe('getUnPluggedLessonCompletionStatus', () => {
    it('incomplete when no teacher scores for stage', () => {
      expect(
        getUnpluggedLessonCompletionStatus(fakeState, scriptId, stageId)
      ).to.deep.equal({
        completed: false,
        numStudentsCompleted: 0
      });
    });

    it('incomplete when teacher scores stage as incomplete', () => {
      expect(
        getUnpluggedLessonCompletionStatus(
          stateForTeacherMarkedIncompletedLesson,
          scriptId,
          stageId
        )
      ).to.deep.equal({
        completed: false,
        numStudentsCompleted: 0
      });
    });

    it('complete when teacher scores stage as complete', () => {
      expect(
        getUnpluggedLessonCompletionStatus(
          stateForTeacherMarkedCompletedLesson,
          scriptId,
          stageId
        )
      ).to.deep.equal({
        completed: true,
        numStudentsCompleted: 1
      });
    });
  });

  describe('getPluggedLessonCompletionStatus', () => {
    it('accurately calculates no progress', () => {
      expect(getPluggedLessonCompletionStatus(fakeState, stage)).to.deep.equal({
        completed: false,
        numStudentsCompleted: 0
      });
    });

    it('accurately calculates partial progress', () => {
      expect(
        getPluggedLessonCompletionStatus(
          stateForPartiallyCompletedLesson,
          stage
        )
      ).to.deep.equal({
        completed: false,
        numStudentsCompleted: 2
      });
    });

    it('accurately calculates > 80% of students completed > 60% of levels', () => {
      expect(
        getPluggedLessonCompletionStatus(stateForCompletedLesson, stage)
      ).to.deep.equal({
        completed: true,
        numStudentsCompleted: 4
      });
    });
  });

  describe('getNumberLessonsCompleted', () => {
    it('accurately calculates number of lessons completed when there is no student progress', () => {
      expect(getNumberLessonsCompleted(fakeState)).to.equal(0);
    });

    it('accurately calculates the number of lessons completed when there is student progress', () => {
      expect(getNumberLessonsCompleted(stateForCompletedLesson)).to.equal(1);
    });
  });
});
