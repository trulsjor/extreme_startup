require 'spec_helper'
require 'extreme_startup/question_factory'
require 'extreme_startup/player'

module ExtremeStartup
  describe ClockAngleQuestion do
    let(:question) { ClockAngleQuestion.new(Player.new) }

    it "converts to a string" do
      question.as_text.should =~ /What is the smaller angle between the minute and hour hand at \d\d:\d\d?/i
    end

    context "when the numbers and known" do
      let(:question1) { ClockAngleQuestion.new(Player.new, "13:49") }
      let(:question2) { ClockAngleQuestion.new(Player.new, "18:00") }
      let(:question3) { ClockAngleQuestion.new(Player.new, "20:34") }

      it "converts to the right string" do
        question1.as_text.should == "What is the smaller angle between the minute and hour hand at 13:49?"
      end

      it "identifies a correct answer" do
        question1.answered_correctly?("121").should be_true
        question2.answered_correctly?("180").should be_true
        question3.answered_correctly?("53").should be_true
      end

      it "identifies an incorrect answer" do
        question1.answered_correctly?("240").should be_false
      end
    end

    context "when the angle is > 180 degrees" do
      it "should give the correct answer" do
        ClockAngleQuestion.new(Player.new, "21:00").answered_correctly?("90").should be_true
        ClockAngleQuestion.new(Player.new, "22:10").answered_correctly?("115").should be_true
      end
    end

  end
end
