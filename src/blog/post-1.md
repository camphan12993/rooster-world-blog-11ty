---
title: Using Angular in the right way
topic: Coding
date: 2020-01-01
author: Cam Phan
image: /src/assets/img/template2.jpg
excerpt: The purpose of this article is to make our Angular template code
  readable and enable a high-caliber performance by following the right
  practices. It's very useful to have good practices in place for an Angular
  template to overcome the future performance-related issues in the enterprise
  application.
---
The purpose of this article is to make our Angular template code readable and enable a high-caliber performance by following the right practices. It's very useful to have good practices in place for an Angular template to overcome the future performance-related issues in the enterprise application.

In this article we'll learn the most appropriate approach for binding the data with a few common use cases of template syntax binding, and how efficiently we can solve the current/future problems.

I am assuming that you have a basic understanding of [Angular Template Syntax](https://angular.io/guide/template-syntax).

Before beginning with the actual use case, let's brush-up Angular interpolation in the template for binding the text.

```html
 {{title}}
```



```js
title:string = "Template Syntax Binding";
```

### Logical Template Syntax[\#](https://indepth.dev/using-angular-in-the-right-way-template-syntax/#logical-template-syntax)

Let's refer to the below code then after discussing in detail:

```html
Percentage {{ totalMarks / 600 }}
```

In the similar fashion of this practice, we usually do a lot in the multiple templates. This arises a code readability, maintainability, and reusability concern on a bigger template because HTML templates are not meant for writing business logic. It's good to write a logical code in the TS file.

The recommended approach is to create a getter property in the component and use the respective property in the HTML template. Here is the transformed code :

```html
{{percentage}}
```

```js
get percentage() {
 return this.totalMarks / 600;
}
```

The above code gives us the opportunity to use the same code in multiple areas: in the template and in the component as well, if necessary.

### Calling method from Template[\#](https://indepth.dev/using-angular-in-the-right-way-template-syntax/#calling-method-from-template)

In my early days of Angular, I was calling the component methods from the Angular template in my smart component. As the data is coming from the parent component, I was comfortable to call the method from the HTML, because this is easier than the other approaches (shortcuts are always useful for developers). One of the code snippet I am putting here.

```html
{{getOffer(amount)}}
```

```js
    @Input() amount:number

    getOffer(amount:number){
        if(amount > 3500  && amount < 4999)
           return `You will get 20% off on 5k purchase`;
        else if (amount > 5000)
           return `You will get 30% off on 7k purchase`;
        else
           return `5% off on your existing purchase.`;
	}
```

There is no problem with the above code, according to the Angular documentation. However, I see a lot of potential issues with this approach. If there is a complex business rule, then the template rendering will take time, and the performance will degrade.

Let's transform the code:

```html
    {{offerMessage}}
```

```js
    offerMessage: string;

    @Input() set amount(value: number) {
        let message: string = '';
        if (value > 5000)
            message = `You will get 30% off on 7k purchase`;
        else if (value > 3500 && value < 4999)
            message = `You will get 20% off on 5k purchase`;
        else
            message = `5% off on your existing purchase.`;
        this.offerMessage = message;
    }
```

As per the above-shown code, we have used the setter method for `amount` property, whenever the setter method is called at that time it will set the `offerMessage` based upon the value. So there is no need to call the method from the template. Seems good, but you may think why I have used the setter method if we can achieve the same thing by using the `ngOnChanges` method. We can, But if the complexity grows then it's difficult to manage a lot of code in the `ngOnChanges` method with `if` clauses and somewhere we lose the power of scalable code in TypeScript. It's up to you to decide which one is better for your application as per the complexity. I prefer both approaches based on my component complexity. If I have multiple `@Input` decorator properties then I would prefer to go with the setter method otherwise happy with the `ngOnChanges`.

So far so good.

As per the above solution we may have a question that **which approach we should choose between getter properties and methods?**

By convention, a method represents an action and a property represents some data. Getter properties are useful where there's no computational complexity, proxying a value of another object or hiding private variables, etc. On the other hand, the methods are useful where our business operation is too expensive or async processes, etc.

I would like to share one of the use case which is not sufficient for `setter` / `ngOnChanges` approach:

> The data is coming from the server which returns Student Name, Total Marks and we have to show the Student Name, Grade (computational calculation) in the table.

Again, I preferred to call the method from the template, like below:

```html
<table>
<tr *ngFor="let student of students">
<td>{{student.name}}</td>
<td>{{getGrade(student)}}</td>
</tr>
</table>
```

```js
students:any[] = [{ id: 1, name: 'John', marks: 65 }, ...]

getGrade(marks: number) {
        let grade: string = 'F';
        if (marks >= 85)
            grade = 'S'
        else if (marks > 60 && marks < 85)
            grade = 'A'
        return grade;
    }
```

To solve the problem, we should apply [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle).

See the transformed code below:

```html
<td>{{student.grade}}</td>
```

```js
students:Student[] = [new Student({ id: 1, name: 'John', marks: 65 }), ...]

```

```js
export class Student {
    constructor(data: Partial<StudentModel>) {
        this.id = data.id;
        this.name = data.name;
        this.grade = this.getGrade(data.marks);
        this.marks = data.marks;
    }

    id: number;
    name: string;
    marks: number;
    grade: string;

    private getGrade(marks: number) {
        let grade: string = 'F';
        if (marks >= 85)
            grade = 'S'
        else if (marks > 60 && marks < 85)
            grade = 'A'
        return grade;
    }
}
```

Let's discuss a few questions you may have.

**Why we have created a class when we can achieve the same thing without class?**

True, we can. But we are losing the benefit of Single Responsibility Principle practices, because other than the class we have to write the code for grade calculation whether in the service class / component / Angular Template, apparently the code become clumsy/duplicate if the same entity is used with minor modification in multiple components with different service classes. Creating a class gives us the power to use the same behavior of the entity in multiple components. This fulfills the need of code maintainability and reusability.

> Classes are valuable, this only fits when we may need to initialize the properties and methods to help create objects/process business rules.

**Why we haven’t used Pure Pipe?**

Pure pipes are good, this definitely saves our additional looping which is going to be done by following the class approach. But I believe pipes are not meant to cover this kind of case. I will explain this in the upcoming article "Using Angular in the right way: Pipes".

**Why we are not using memoization in the grading method of the component?**

In simple words, memoization is used for heavy computational logic which can significantly improve the performance and our case is not suitable for memorization. If we go with this approach, it may increase the memory consumption as well as the code complexity, if there are multiple methods to be used in the template.

So far we are focusing on accessing the Object property instead of the method in the template, but this is not enough for rendering template faster. **Why?**

There are two improvements we can make in this code: bind data with ngFor and apply `OnPush` change detection strategy.

### Binding Data with *ngFor[\#](https://indepth.dev/using-angular-in-the-right-way-template-syntax/#binding-data-with-ngfor)

After updating the anyone row of student list, the entire list is recomputed. This impacts a performance issue with a larger data. To solve this problem, we can use \`\`\`trackBy\`\`\` function, which helps Angular to know how to track our element in the student collection, the only modified value will be recomputed and repainted rather than the whole collection. Refer to the modified code below:

```html
<tr *ngFor="let student of students; trackBy:trackByFn">
    <td>{{student.name}}</td>
    <td>{{student.grade}}</td>
  </tr>
```

```js
    trackByFn(index, item) {
        return item.id;
    }
```

### OnPush Change Detection Strategy[\#](https://indepth.dev/using-angular-in-the-right-way-template-syntax/#onpush-change-detection-strategy)

By default, Angular performs change detection on all component everytime something changes in the application, this checks if the value of template expressions have changed. If the component complexity grows then it takes more time to check, but through `ChangeDetectionStrategy.OnPush` we tell Angular to check only if the references have changed rather than checking for the values of every property. With this approach, we significantly improve the performance and when we want to update an object, the respective object to be propagated to the view.

With `OnPush`, change detection runs for the component when:

* The Input reference changes.
* A native DOM event is triggered from the component or one of it's children.
* Change detection is triggered manually through `detectChanges` method of the [ChangeDetectorRef](https://angular.io/api/core/ChangeDetectorRef) class.
* Async pipe observable gets new value.

Here is the code:

```js
@Component({
    selector: 'app-product',
    template: `...`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent { ... }
```

To learn more, please refer to the article by [Max Koretskyi](https://indepth.dev/author/maxkoretskyi/)on [Change Detection](https://indepth.dev/these-5-articles-will-make-you-an-angular-change-detection-expert/).

### Conclusion[\#](https://indepth.dev/using-angular-in-the-right-way-template-syntax/#conclusion)

The discussed approach provides the flexibility to modularly assemble our code based upon the specific need. It's good to use object property in the template to make our template code readable and performative as compared to method approach.

You may have a lot of questions on bindings or reactive forms elegant approach. Wait for the upcoming articles. For Angular Forms, you can refer to the [Armen Vardanyan](https://indepth.dev/author/armen/) superb article on [Angular Forms: Useful Tips](https://indepth.dev/angular-forms-useful-tips/) and [Angular: The unexpected](https://indepth.dev/angular-the-unexpected/). I liked both articles and I am sure you will learn a lot.