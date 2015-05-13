/**
 * Created by DIYgod on 15/5/10.
 */

// localStorage + JSON 存储任务数据
// cate代表分类，childCate代表子分类，task代表任务
var cate;
var childCate;
var task;

var cateText = '['
    + '{'
    +     '"id": 0,'
    +     '"name": "默认分类",'
    +     '"num": 0,'
    +     '"child": []'
    + '},'
    + '{'
    +     '"id": 1,'
    +     '"name": "百度IFE项目",'
    +     '"num": 4,'
    +     '"child": [0, 1]'
    + '}'
+ ']';

var childCateText = '['
    + '{'
    +     '"id": 0,'
    +     '"name": "task0001",'
    +     '"child": [0, 1, 2],'
    +     '"father": 1'
    + '},'
    + '{'
    +     '"id": 1,'
    +     '"name": "task0002",'
    +     '"child": [3],'
    +     '"father": 1'
    + '}'
+ ']';

var taskText = '['
    + '{'
    +     '"id": 0,'
    +     '"name": "to-do 1",'
    +     '"father": 0,'
    +     '"finish": true,'
    +     '"date": "2015-05-28",'
    +     '"content": "开始 task0001 的编码任务。"'
    + '},'
    + '{'
    +     '"id": 1,'
    +     '"name": "to-do 3",'
    +     '"father": 0,'
    +     '"finish": true,'
    +     '"date": "2015-05-30",'
    +     '"content": "完成 task0001 的编码任务。"'
    + '},'
    + '{'
    +     '"id": 2,'
    +     '"name": "to-do 2",'
    +     '"father": 0,'
    +     '"finish": false,'
    +     '"date": "2015-05-29",'
    +     '"content": "重构 task0001 的编码任务。"'
    + '},'
    + '{'
    +     '"id": 3,'
    +     '"name": "to-do 4",'
    +     '"father": 1,'
    +     '"finish": false,'
    +     '"date": "2015-06-29",'
    +     '"content": "完成 task0002 的编码任务。"'
    + '}'
+ ']';

// 生成任务分类列表
function makeType() {
    $('#type-all').innerHTML = '<i class="icon-menu"></i><span>所有任务</span>(' + task.length + ')'
    var html = '';
    for (var i = 0; i < cate.length; i++) {
        html += ''
            + '<li>'
            +     '<h3 onclick="typeClick(this)">'
            +         '<i class="icon-folder-open-empty"></i><span>' + cate[i].name + '</span>(' + cate[i].num + ')<i class="delete icon-minus-circled" onclick="del(event, this)"></i>'
            +     '</h3>'
            +     '<ul class="item">';

        for (var j = 0; j < cate[i].child.length; j++) {
            var childNode = getObjByKey(childCate, 'id', cate[i].child[j]);
            html += ''
            +         '<li>'
            +             '<h4 onclick="typeClick(this)">'
            +                 '<i class="icon-doc-text"></i><span>' + childNode.name + '</span>(' + childNode.child.length + ')<i class="delete icon-minus-circled" onclick="del(event, this)"></i>'
            +             '</h4>'
            +         '</li>'
        }
        html += ''
            +     '</ul>'
            + '</li>'
    }
    html = html.replace(/<i class="delete icon-minus-circled" onclick="del\(event, this\)"><\/i>/, '');    // 去掉默认分类的删除按钮
    $('.item-wrap').innerHTML = html;

    $('h2').onclick();             // 默认选择第一个分类

    makeTask();
}

// 生成任务列表
function makeTask() {
    var ele = $('.type-wrap .choose');
    var eleTag = ele.tagName.toLowerCase();
    var name = ele.getElementsByTagName('span')[0].innerHTML;
    var taskIdArr = [];
    switch (eleTag) {
        case 'h2':                               // 选中了所有任务
            for (var i = 0; i < task.length; i++) {
                taskIdArr.push(task[i].id);
            }
            makeTaskById(taskIdArr);
            break;
        case 'h3':                               // 选中了分类
            var cateObj = getObjByKey(cate, 'name', name);     // 得到任务分类对象
            for (var i = 0; i < cateObj.child.length; i++) {
                var childObj = getObjByKey(childCate, 'id', cateObj.child[i]);  // 得到任务子分类对象
                for (var j = 0; j < childObj.child.length; j++) {
                    taskIdArr.push(childObj.child[j]);
                }
            }
            makeTaskById(taskIdArr);
            break;
        case 'h4':                               // 选中了子分类
            var childObj = getObjByKey(childCate, 'name', name);  // 得到任务子分类对象
            for (var i = 0; i < childObj.child.length; i++) {
                taskIdArr.push(childObj.child[i]);
            }
            makeTaskById(taskIdArr);
            break;
    }

    makeDetails();
}

// 根据传入的ID生成任务列表
function makeTaskById(taskIdArr) {
    var date = [];
    var taskObj;
    for (var i = 0; i < taskIdArr.length; i++) {              // 得到所有日期
        taskObj = getObjByKey(task, 'id', taskIdArr[i]);
        date.push(taskObj.date);
    }
    date = uniqArray(date);
    date = sortDate(date);      // 排序

    var html = '';
    for (var i = 0; i < date.length; i++) {
        html += ''
            + '<li>'
            +     '<h5>' + date[i] + '</h5>'
            +     '<ul class="item">'
        for (var j = 0; j < taskIdArr.length; j++) {
            taskObj = getObjByKey(task, 'id', taskIdArr[j]);
            if (taskObj.date === date[i]) {
                if (taskObj.finish === true) {
                    html += ''
            +         '<li class="task-item task-finish">'
                }
                else if (taskObj.finish === false) {
                    html += ''
            +         '<li class="task-item">'
                }
                html += ''
            +             '<h6 onclick="taskClick(this)">'
            +                 '<i class="icon-check"></i><span>' +taskObj.name + '</span><i class="delete icon-minus-circled" onclick="del(event, this)"></i>'
            +             '</h6>'
            +         '</li>'
            }
        }
        html += ''
            +     '</ul>'
            + '</li>'
    }
    document.getElementsByClassName('task-wrap')[0].innerHTML = html;
    if ($('h6')) {
        $('h6').onclick();             // 默认选择第一个任务
    }
}

// 根据某对象的某属性得到某对象
function getObjByKey(obj, key, value) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] === value) {
            return obj[i];
        }
    }
}

// 对任务时间进行排序
function sortDate(date) {
    return date.sort(function (a, b) {
        return a.replace(/-/g, '') - b.replace(/-/g, '');
    });
}

// 生成任务详细描述部分
function makeDetails() {
    var ele = $('.task-wrap .choose');
    var info = document.getElementsByClassName('details')[0].getElementsByTagName('span');
    if (!($('.task-wrap .choose').length === 0)) {
        var name = ele.getElementsByTagName('span')[0].innerHTML;
        var taskObj = getObjByKey(task, 'name', name);
        info[0].innerHTML = taskObj.name;
        info[1].innerHTML = taskObj.date;
        info[2].innerHTML = taskObj.content;
        $('.set').style.display = 'inline';
    }
    else {                               // 任务列表为空的情况
        info[0].innerHTML = '';
        info[1].innerHTML = '';
        info[2].innerHTML = '';
        $('.set').style.display = 'none';
    }
}

// 任务分类列表点击效果
function typeClick(ele) {
    var otherChoose = ele.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('*');
    for (var i = 0; i < otherChoose.length; i++) {
        if (otherChoose[i].className === 'choose') {
            otherChoose[i].className = '';
            break;
        }
    }
    ele.className = 'choose';
    makeTask();
}

// 任务列表点击效果
function taskClick(ele) {
    var otherChoose = ele.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('*');
    for (var i = 0; i < otherChoose.length; i++) {
        if (otherChoose[i].className === 'choose') {
            otherChoose[i].className = '';
            break;
        }
    }
    ele.className = 'choose';
    makeDetails();
}

// 筛选菜单点击效果
function statusClick(ele) {
    var otherChoose = ele.parentNode.getElementsByTagName('*');
    for (var i = 0; i < otherChoose.length; i++) {
        if (otherChoose[i].className === 'choose') {
            otherChoose[i].className = '';
            break;
        }
    }
    ele.className = 'choose';
    var myEle;
    if (ele.innerHTML.indexOf('所有') !== -1) {
        myEle = $('.task-wrap').getElementsByTagName('li');
        for (var i = 0; i < myEle.length; i++) {
            myEle[i].style.display = 'block';
        }
    }
    else if (ele.innerHTML.indexOf('已完成') !== -1) {
        myEle = $('.task-wrap').getElementsByTagName('li');
        for (var i = 0; i < myEle.length; i++) {
            myEle[i].style.display = 'none';
        }
        for (var i = 0; i < myEle.length; i++) {
            if (myEle[i].className.indexOf('task-finish') !== -1) {
                myEle[i].style.display = 'block';
                myEle[i].parentNode.parentNode.style.display = 'block';
            }
        }
    }
    else if (ele.innerHTML.indexOf('未完成') !== -1) {
        myEle = $('.task-wrap').getElementsByTagName('li');
        for (var i = 0; i < myEle.length; i++) {
            myEle[i].style.display = 'none';
        }
        for (var i = 0; i < myEle.length; i++) {
            if (myEle[i].className.indexOf('task-finish') === -1 && myEle[i].parentNode.className === 'item') {
                myEle[i].style.display = 'block';
                myEle[i].parentElement.parentElement.style.display = 'block';
            }
        }
    }

    var h6 = document.getElementsByTagName('h6');        // 默认选择第一个任务
    for (var i = 0; i < h6.length; i++) {
        if (h6[i].parentNode.style.display !== 'none') {
            h6[i].onclick();
            break;
        }
    }
}

// 新增分类弹窗
function typeAdd() {
    $('.pop').style.display = 'block';
    $('.overlay').style.display = 'block';
    $('.pop-name').innerHTML = '新增分类';
    var html = ''
        + '<p>'
        +     '新分类名称:'
        +     '<input type="text" class="myText" placeholder="在此输入新分类的名称">'
        + '</p>'
        + '<p>'
        +     '新分类父节点:'
        +     '<select class="mySelect">'
        +         '<option value="-1">无</option>'

    var itemWrap = document.getElementsByClassName('item-wrap')[0];
    var itemName = itemWrap.getElementsByTagName('h3');
    for (var i = 0; i < itemName.length; i++) {
        html += ''
        +         '<option value="'+ i +'">' + itemName[i].getElementsByTagName('span')[0].innerHTML + '</option>'
    }

    html += ''
        +     '</select>'
        + '</p>'
        + '<button class="myButton" onclick="closePop()">取消</button>'
        + '<button class="myButton" onclick="newType()">确定</button>'

    $('.pop-content').innerHTML = html;
}

// 新增任务，进入编辑模式
function taskAdd() {

}

// 弹窗关闭按钮
function closePop() {
    $('.pop').style.display = 'none';
    $('.overlay').style.display = 'none';
}

// 新建分类
function newType() {
    var name = $('.myText').value;
    var fatherName = $('.mySelect').value;
    if (fatherName === '-1') {             // 添加分类
        var newCate = {
            "id": cate[cate.length - 1].id + 1,
            "name": name,
            "num": 0,
            "child": []
        };
        cate.push(newCate);
        localStorage.cate = JSON.stringify(cate);  // 保存
    }
    else {                                 // 添加子分类
        var newChild = {
            "id": childCate[childCate.length - 1].id + 1,
            "name": name,
            "child": [],
            "father": cate[$('.mySelect').value].id
        };
        var father = getObjByKey(cate, 'id', newChild.father)   // 父节点对象
        father.child.push(newChild.id);                       // 在父节点中登记
        childCate.push(newChild);
        localStorage.cate = JSON.stringify(cate);  // 保存
        localStorage.childCate = JSON.stringify(childCate);
    }
    makeType();
    closePop();
}

// 新建任务
function newTask() {

}

/* todo
 * num刷新
 * 检测分类名的合法性
 * 将无分类的任务移置默认分组
 */
// 点击了删除按钮
function del(e, ele) {
    window.event ? window.event.cancelBubble = true : e.stopPropagation();  // 阻止事件冒泡
    var ele = ele.parentNode;
    var tag = ele.tagName.toLowerCase();
    var index;
    var name;
    switch (tag) {
        case 'h3':                                                          // 删除一个分类
            name = ele.getElementsByTagName('span')[0].innerHTML;
            index = getIndexByKey(cate, 'name', name);
            for (var i = 0; i < cate[index].child.length; i++) {            // 删除该分类的所有子分类
                var childIndex = getIndexByKey(childCate, 'id', cate[index].child[i]);
                childCate.splice(childIndex, 1);
            }
            localStorage.cate = JSON.stringify(childCate);                  // 保存
            cate.splice(index, 1);
            localStorage.cate = JSON.stringify(cate);                       // 保存
            makeType();
            break;
        case 'h4':                                                          // 删除一个子分类
            name = ele.getElementsByTagName('span')[0].innerHTML;
            index = getIndexByKey(childCate, 'name', name);
            var fatherIndex = getIndexByKey(cate, 'id', childCate[index].father);  // 删除父节点中的记录
            cate[fatherIndex].child.splice(cate[fatherIndex].child.indexOf(childCate[index].id), 1);
            childCate.splice(index, 1);
            localStorage.cate = JSON.stringify(childCate);                  // 保存
            makeType();
            break;
    }
}

// 根据某对象的某属性得到某对象的序号
function getIndexByKey(obj, key, value) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] === value) {
            return i;
        }
    }
}

window.onload = function () {
    //if (!localStorage.getItem('cate')) {  // 页面之前没被访问过的情况，载入默认值
        localStorage.cate = cateText;
        localStorage.childCate = childCateText;
        localStorage.task = taskText;
        document.getElementById('type-all').className = 'choose';
    //}
    cate = eval('(' + localStorage.cate + ')');
    childCate = eval('(' + localStorage.childCate + ')');
    task = eval('(' + localStorage.task + ')');
    makeType();
}