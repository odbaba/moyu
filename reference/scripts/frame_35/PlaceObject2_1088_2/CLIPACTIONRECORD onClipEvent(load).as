onClipEvent(load){
   function talk()
   {
      _root.talk.openme(this);
      words = "　　谢谢你帮我找到五福娃，关于幻兽培养的技术我已经把相关的资料送给幻兽研究所了。";
      words += "\r　还有100,000魔石作为报酬送给你吧。";
      _root.talk.words(words,"2008奥运使者");
      var _loc3_ = 1;
      _root.talk.answer(_loc3_++,"谢谢");
   }
   function answer(num)
   {
      if(num === 1)
      {
         _root.hsyjs_jsdjmax = 150;
         _root.hsyjsvip += 1;
         _root.beibao.subms(100000);
         _root.alertbox("完成任务。获得100,000魔石奖励。幻兽研究所技术等级上限从120级升高到150级了。你被幻兽研究所提升为" + _root.hsyjsvip + "星VIP会员");
         _root.talk.closeme();
         _root.gotoAndStop("卡萨诺城");
      }
   }
}
